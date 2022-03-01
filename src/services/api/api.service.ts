import { httpClient } from "../http/http.service";

export enum PersonType {
  NATURAL = "NATURAL",
  LEGAL = "LEGAL",
}
export interface CashInResponse {
  data: {
    percents: number;
    max: {
      amount: number;
      currency: "EUR";
    };
  };
}

export interface CashOutNaturalResponse {
  data: {
    percents: number;
    week_limit: {
      amount: number;
      currency: "EUR";
    };
  };
}

export interface CashOutJuridicalResponse {
  data: {
    percents: number;
    min: {
      amount: number;
      currency: "EUR";
    };
  };
}

export class ApiService {
  API_BASE = "https://developers.paysera.com/tasks/api";

  async cashIn(): Promise<CashInResponse["data"]> {
    const response = await httpClient.get<{}, CashInResponse>(
      `${this.API_BASE}/cash-in`
    );

    return response.data;
  }

  async cashOutNatural(): Promise<CashOutNaturalResponse["data"]> {
    const response = await httpClient.get<{}, CashOutNaturalResponse>(
      `${this.API_BASE}/cash-out-natural`
    );

    return response.data;
  }

  async cashOutJuridical(): Promise<CashOutJuridicalResponse["data"]> {
    const response = await httpClient.get<{}, CashOutJuridicalResponse>(
      `${this.API_BASE}/cash-out-juridical`
    );

    return response.data;
  }
}
