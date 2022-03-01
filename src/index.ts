import fs from "fs";
import { ApiService } from "./services/api/api.service";
import { OperationService } from "./services/operation/operation.service";
import { Operation } from "./types/operation";

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    throw Error(
      "You should specify an input file for the script to work. for instance: node index.js input.json"
    );
  }

  const inputFileName = args[0];

  const jsonContent = fs.readFileSync(inputFileName);
  const operations: Operation[] = JSON.parse(jsonContent.toString()); // parsed data from the JSON file

  // Manual dependency injection
  const apiService = new ApiService();
  const operationService = new OperationService(apiService);

  const output: number[] = [];
  for (const operation of operations)
    output.push(await operationService.calculate(operation));

  console.log(output.join("\n"));
};

main();
