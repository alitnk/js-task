import type { Money } from "../../types/money";
import { httpClient } from "../http/http.service";

export interface CashInResponse {
  data: {
    percents: number;
    max: Money;
  };
}

export interface CashOutNaturalResponse {
  data: {
    percents: number;
    week_limit: Money;
  };
}

export interface CashOutJuridicalResponse {
  data: {
    percents: number;
    min: Money;
  };
}

export class ApiService {
  API_BASE = "https://developers.paysera.com/tasks/api";

  /**
   * This "cache" layer is here to prevent app from making too many calls to the API.
   * It is a very simple implementation. In a real-world app this would need more attention. (perhaps re-validating after a timeout for when the app runs for a long time)
   */
  cache = {
    cashIn: null,
    cashOutNatural: null,
    cashOutJuridical: null,
  };

  /**
   * Get the fee config for cash-in from the API.
   */
  async cashIn(): Promise<CashInResponse["data"]> {
    if (this.cache.cashIn) return this.cache.cashIn;

    const response = await httpClient.get<{}, CashInResponse>(
      `${this.API_BASE}/cash-in`
    );

    this.cache.cashIn = response.data;
    return response.data;
  }

  /**
   * Get the fee config for cash-out for natural persons from the API.
   */
  async cashOutNatural(): Promise<CashOutNaturalResponse["data"]> {
    if (this.cache.cashOutNatural) return this.cache.cashOutNatural;

    const response = await httpClient.get<{}, CashOutNaturalResponse>(
      `${this.API_BASE}/cash-out-natural`
    );

    this.cache.cashOutNatural = response.data;
    return response.data;
  }

  /**
   * Get the fee config for cash-out for juridical representatives from the API.
   */
  async cashOutJuridical(): Promise<CashOutJuridicalResponse["data"]> {
    if (this.cache.cashOutJuridical) return this.cache.cashOutJuridical;

    const response = await httpClient.get<{}, CashOutJuridicalResponse>(
      `${this.API_BASE}/cash-out-juridical`
    );

    this.cache.cashOutJuridical = response.data;
    return response.data;
  }
}
