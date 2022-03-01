import axios from "axios";
import type {
  CashInResponse,
  CashOutJuridicalResponse,
  CashOutNaturalResponse,
} from "./api.service";
import { ApiService } from "./api.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("cash-in route works", async () => {
  const serverResponse: CashInResponse = {
    data: {
      percents: 0.03,
      max: {
        amount: 5,
        currency: "EUR",
      },
    },
  };

  mockedAxios.get.mockResolvedValue(serverResponse);

  const apiService = new ApiService();
  expect(await apiService.cashIn()).toBe(serverResponse.data);
});

test("cash-out-natural route works", async () => {
  const serverResponse: CashOutNaturalResponse = {
    data: {
      percents: 0.3,
      week_limit: {
        amount: 1000,
        currency: "EUR",
      },
    },
  };

  mockedAxios.get.mockResolvedValue(serverResponse);

  const apiService = new ApiService();
  expect(await apiService.cashOutNatural()).toBe(serverResponse.data);
});

test("cash-out-juridical route works", async () => {
  const serverResponse: CashOutJuridicalResponse = {
    data: {
      percents: 0.3,
      min: {
        amount: 0.5,
        currency: "EUR",
      },
    },
  };

  mockedAxios.get.mockResolvedValue(serverResponse);

  const apiService = new ApiService();
  expect(await apiService.cashOutJuridical()).toBe(serverResponse.data);
});
