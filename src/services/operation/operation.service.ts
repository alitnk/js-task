import { Operation } from "../../types/operation";
import { UserType } from "../../types/user-type";
import { ApiService } from "../api/api.service";

export class OperationService {
  constructor(private readonly apiService: ApiService) {}

  async cashIn(operation: Operation): Promise<number> {
    const cashInConfig = await this.apiService.cashIn();
    return 1;
  }

  async cashOutNatural(operation: Operation): Promise<number> {
    const cashOutNaturalConfig = await this.apiService.cashOutNatural();
    return 2;
  }

  async cashOutJuridical(operation: Operation): Promise<number> {
    const cashOutJuridicalConfig = await this.apiService.cashOutJuridical();
    return 3;
  }

  cashOut(type: UserType, operation: Operation): Promise<number> {
    switch (type) {
      case UserType.Natural:
        return this.cashOutNatural(operation);
      case UserType.Juridical:
        return this.cashOutJuridical(operation);
    }
  }
}
