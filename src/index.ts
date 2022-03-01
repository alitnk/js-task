import fs from "fs";
import { ApiService } from "./services/api/api.service";
import { OperationService } from "./services/operation/operation.service";
import { OperationWrapper } from "./types/operation";
import { OperationType } from "./types/operation-type";
import { UserType } from "./types/user-type";

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    throw Error(
      "You should specify an input file for the script to work. for instance: node index.js input.json"
    );
  }

  const inputFileName = args[0];

  const jsonContent = fs.readFileSync(inputFileName);
  const operations: OperationWrapper[] = JSON.parse(jsonContent.toString()); // parsed data from the JSON file

  // Manual injection
  const apiService = new ApiService();
  const operationService = new OperationService(apiService);

  const output: number[] = [];
  for (const { operation, type, user_type } of operations) {
    switch (type) {
      case OperationType.CashIn:
        output.push(await operationService.cashIn(operation));
      case OperationType.CashOut:
        switch (user_type) {
          case UserType.Natural:
            output.push(await operationService.cashOutNatural(operation));
          case UserType.Juridical:
            output.push(await operationService.cashOutJuridical(operation));
        }
    }
  }

  console.log(output.join("\n"));
};

main();
