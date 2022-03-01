import { OperationType } from "./operation-type";
import { UserType } from "./user-type";

export interface Operation {
  date: String;
  user_id: number;
  user_type: UserType;
  type: OperationType;
  operation: {
    amount: number;
    currency: "EUR";
  };
}
