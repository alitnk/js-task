import { Currency } from "../../types/currency";
import { Money } from "../../types/money";
import type { Operation } from "../../types/operation";
import { OperationType } from "../../types/operation-type";
import type { UserId } from "../../types/user-id";
import { UserType } from "../../types/user-type";
import { getWeekScope } from "../../utils/week";
import { ApiService, CashOutNaturalResponse } from "../api/api.service";

export class OperationService {
  constructor(private readonly apiService: ApiService) {}

  /**
   * This works as a data store / repository for us to keep track of free fees.
   * In a real-world application, this would probably be an actual database.
   */
  protected freeFeeLimit: Record<string, Record<UserId, number>> = {};

  /**
   * Calculate the fee to pay for an operation.
   */
  calculate(operation: Operation): Promise<number> {
    switch (operation.type) {
      case OperationType.CashIn:
        return this.cashIn(operation);
      case OperationType.CashOut:
        switch (operation.user_type) {
          case UserType.Natural:
            return this.cashOutNatural(operation);
          case UserType.Juridical:
            return this.cashOutJuridical(operation);
        }
    }
  }

  /**
   * Calculate the fee for cashing in.
   */
  protected async cashIn({
    operation: { amount, currency },
  }: Operation): Promise<number> {
    const cashInFee = await this.apiService.cashIn();

    const fee = Math.min(
      cashInFee.max.amount,
      (amount * cashInFee.percents) / 100
    );
    const roundedFee = this.round({ amount: fee, currency });
    return roundedFee;
  }

  /**
   * Calculate the fee for cashing out as a natural person.
   */
  protected async cashOutNatural(operation: Operation): Promise<number> {
    let {
      operation: { amount, currency },
    } = operation;
    const cashOutNaturalFee = await this.apiService.cashOutNatural();

    amount = this.applyFreeFee(operation, cashOutNaturalFee);

    const fee = (amount * cashOutNaturalFee.percents) / 100;
    const roundedFee = this.round({ amount: fee, currency });
    return roundedFee;
  }

  /**
   * Calculate the fee for cashing out as a juridical representative.
   */
  protected async cashOutJuridical({
    operation: { amount, currency },
  }: Operation): Promise<number> {
    const cashOutJuridicalFee = await this.apiService.cashOutJuridical();

    const fee = Math.max(
      cashOutJuridicalFee.min.amount,
      (amount * cashOutJuridicalFee.percents) / 100
    );
    const roundedFee = this.round({ amount: fee, currency });
    return roundedFee;
  }

  /**
   * Rounds the fee.
   */
  protected round({ currency, amount }: Money) {
    switch (currency) {
      case Currency.EUR:
        return Math.round(amount * 100) / 100;
    }
  }

  /**
   * An internal function for natural persons cashing out to apply free fees.
   */
  protected applyFreeFee(
    { user_id, date: dateString, operation: { amount, currency } }: Operation,
    naturalFee: CashOutNaturalResponse["data"]
  ) {
    const date = new Date(dateString);
    const scope = this.weeklyScopeDate(date);

    if (typeof this.freeFeeLimit[scope] === "undefined")
      this.freeFeeLimit[scope] = {};

    switch (currency) {
      case Currency.EUR:
        const oldUsage =
          typeof this.freeFeeLimit[scope][user_id] === "undefined"
            ? 0
            : this.freeFeeLimit[scope][user_id];

        if (oldUsage >= naturalFee.week_limit.amount) return amount;

        const currentUsage = Math.min(
          oldUsage + amount,
          naturalFee.week_limit.amount
        );
        this.freeFeeLimit[scope][user_id] = currentUsage;

        const feeApplicable = amount - (currentUsage - oldUsage);
        return feeApplicable;
    }
  }

  /**
   * An internal function to generate a tag for scoping the weeks.
   */
  protected weeklyScopeDate(date: Date) {
    return `${date.getFullYear()}_${date.getMonth()}_${getWeekScope(date)}`;
  }
}
