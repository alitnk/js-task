import { Currency } from "../../types/currency";
import { Money } from "../../types/money";
import type { Operation } from "../../types/operation";
import { OperationType } from "../../types/operation-type";
import type { UserId } from "../../types/user-id";
import { UserType } from "../../types/user-type";
import { ApiService } from "../api/api.service";

export class OperationService {
  constructor(private readonly apiService: ApiService) {}

  freeFeeLimit: Record<UserId, number> = {};

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

  protected async cashOutNatural({
    operation: { amount, currency },
  }: Operation): Promise<number> {
    const cashOutNaturalFee = await this.apiService.cashOutNatural();

    // TODO: handle no-fee days and weekly limits here.

    const fee = (amount * cashOutNaturalFee.percents) / 100;
    const roundedFee = this.round({ amount: fee, currency });
    return roundedFee;
  }

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

  protected round({ currency, amount }: Money) {
    switch (currency) {
      case Currency.EUR:
        return Math.round(amount * 100) / 100;
    }
  }
}
