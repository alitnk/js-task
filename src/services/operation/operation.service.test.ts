import { Currency } from "../../types/currency";
import { OperationType } from "../../types/operation-type";
import { UserType } from "../../types/user-type";
import { ApiService } from "../api/api.service";
import { OperationService } from "./operation.service";

const mockApiService: ApiService = {
  API_BASE: "",
  cache: { cashIn: "", cashOutJuridical: "", cashOutNatural: "" },
  async cashIn() {
    return {
      percents: 0.03,
      max: {
        amount: 5,
        currency: Currency.EUR,
      },
    };
  },
  async cashOutNatural() {
    return {
      percents: 0.3,
      week_limit: {
        amount: 1000,
        currency: Currency.EUR,
      },
    };
  },
  async cashOutJuridical() {
    return {
      percents: 0.3,
      min: {
        amount: 0.5,
        currency: Currency.EUR,
      },
    };
  },
};

const createOperationService = () => new OperationService(mockApiService);

test("handles cash-in correctly", async () => {
  const operationService = createOperationService();
  expect(
    await operationService.calculate({
      date: "2016-01-05",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashIn,
      operation: { amount: 200.0, currency: Currency.EUR },
    })
  ).toBe(0.06);
});

test("handles cash-out for juridical representatives correctly", async () => {
  const operationService = createOperationService();
  expect(
    await operationService.calculate({
      date: "2016-01-06",
      user_id: 2,
      user_type: UserType.Juridical,
      type: OperationType.CashOut,
      operation: { amount: 300.0, currency: Currency.EUR },
    })
  ).toBe(0.9);
});

test("handles cash-out for natural persons correctly", async () => {
  const operationService = createOperationService();
  expect(
    await operationService.calculate({
      date: "2016-01-06",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashOut,
      operation: { amount: 1000, currency: Currency.EUR },
    })
  ).toBe(0);
});

test("handles cash-out for natural persons correctly when it exceeds the weekly limit", async () => {
  const operationService = createOperationService();
  expect(
    await operationService.calculate({
      date: "2016-01-06",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashOut,
      operation: { amount: 30000, currency: Currency.EUR },
    })
  ).toBe(87);
});

test("handles cash-out with resetting at the end of each week", async () => {
  const operationService = createOperationService();
  expect(
    await operationService.calculate({
      date: "2016-01-07",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashOut,
      operation: { amount: 500, currency: Currency.EUR },
    })
  ).toBe(0);
  expect(
    await operationService.calculate({
      date: "2016-01-08",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashOut,
      operation: { amount: 1000, currency: Currency.EUR },
    })
  ).toBe(1.5);
  expect(
    await operationService.calculate({
      date: "2016-01-09",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashOut,
      operation: { amount: 1000, currency: Currency.EUR },
    })
  ).toBe(3);
  expect(
    await operationService.calculate({
      date: "2016-01-19",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashOut,
      operation: { amount: 1000, currency: Currency.EUR },
    })
  ).toBe(0);
  expect(
    await operationService.calculate({
      date: "2016-01-26",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashOut,
      operation: { amount: 500, currency: Currency.EUR },
    })
  ).toBe(0);
  expect(
    await operationService.calculate({
      date: "2016-01-28",
      user_id: 1,
      user_type: UserType.Natural,
      type: OperationType.CashOut,
      operation: { amount: 600, currency: Currency.EUR },
    })
  ).toBe(0.3);
});
