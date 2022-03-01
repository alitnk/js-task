import { OperationType } from "./operation-type";
import { UserType } from "./user-type";

export interface OperationWrapper {
  date: String;
  user_id: number;
  user_type: UserType;
  type: OperationType;
  operation: Operation;
}

export interface Operation {
  amount: number;
  currency: "EUR";
}
