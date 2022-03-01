import type { Money } from "./money";
import type { OperationType } from "./operation-type";
import type { UserId } from "./user-id";
import type { UserType } from "./user-type";

export interface Operation {
  date: String;
  user_id: UserId;
  user_type: UserType;
  type: OperationType;
  operation: Money;
}
