import axios from "axios";
import type {
  CashInResponse,
  CashOutJuridicalResponse,
  CashOutNaturalResponse,
} from "./api.service";
import { ApiService } from "./api.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const cashInServerResponse: CashInResponse = {
  data: {
    percents: 0.03,
    max: {
      amount: 5,
      currency: "EUR",
    },
  },
};

test("cash-in route works", async () => {
  mockedAxios.get.mockResolvedValue(cashInServerResponse);
  const apiService = new ApiService();
  expect(await apiService.cashIn()).toBe(cashInServerResponse.data);
});

test("cash-in uses caching", async () => {
  const apiService = new ApiService();

  mockedAxios.get.mockResolvedValue(cashInServerResponse);
  const cashIn1 = await apiService.cashIn(); // First time, gets it from the API
  mockedAxios.get.mockResolvedValue({ data: "totally inaccurate" });
  const cashIn2 = await apiService.cashIn(); // Second time, gets it from the cache

  expect(cashIn1).toEqual(cashIn2);
});

const cashOutNaturalServerResponse: CashOutNaturalResponse = {
  data: {
    percents: 0.3,
    week_limit: {
      amount: 1000,
      currency: "EUR",
    },
  },
};

test("cash-out-natural route works", async () => {
  mockedAxios.get.mockResolvedValue(cashOutNaturalServerResponse);

  const apiService = new ApiService();
  expect(await apiService.cashOutNatural()).toBe(
    cashOutNaturalServerResponse.data
  );
});

test("cash-out-natural uses caching", async () => {
  const apiService = new ApiService();

  mockedAxios.get.mockResolvedValue(cashOutNaturalServerResponse);
  const cashOutNatural1 = await apiService.cashOutNatural(); // First time, gets it from the API
  mockedAxios.get.mockResolvedValue({ data: "totally inaccurate" });
  const cashOutNatural2 = await apiService.cashOutNatural(); // Second time, gets it from the cache

  expect(cashOutNatural1).toEqual(cashOutNatural2);
});

const cashOutJuridicalServerResponse: CashOutJuridicalResponse = {
  data: {
    percents: 0.3,
    min: {
      amount: 0.5,
      currency: "EUR",
    },
  },
};

test("cash-out-juridical route works", async () => {
  mockedAxios.get.mockResolvedValue(cashOutJuridicalServerResponse);

  const apiService = new ApiService();
  expect(await apiService.cashOutJuridical()).toBe(
    cashOutJuridicalServerResponse.data
  );
});

test("cash-out-juridical uses caching", async () => {
  const apiService = new ApiService();

  mockedAxios.get.mockResolvedValue(cashOutJuridicalServerResponse);
  const cashOutJuridical1 = await apiService.cashOutJuridical(); // First time, gets it from the API
  mockedAxios.get.mockResolvedValue({ data: "totally inaccurate" });
  const cashOutJuridical2 = await apiService.cashOutJuridical(); // Second time, gets it from the cache

  expect(cashOutJuridical1).toEqual(cashOutJuridical2);
});
