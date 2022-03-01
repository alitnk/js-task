import fs from "fs";
import { ApiService } from "./services/api/api.service";
import { OperationService } from "./services/operation/operation.service";
import { Operation } from "./types/operation";

// Wrapping the app in a function to use async/await inside of it.
const main = async () => {
  // Getting the argument (JSON file's name).
  const args = process.argv.slice(2);
  if (args.length !== 1)
    throw Error(
      "You should specify an input file for the script to work. for instance: node app.js input.json"
    );

  const inputFileName = args[0];

  // Getting the data from the JSON file.
  const jsonContent = fs.readFileSync(inputFileName);
  const operations: Operation[] = JSON.parse(jsonContent.toString()); // parsed data from the JSON file

  // Manual dependency injection. In a real-world app, I would either use a library like NestJS or use a IoC library (like tsyringe maybe?).
  const apiService = new ApiService();
  const operationService = new OperationService(apiService);

  // Calculating the operations.
  const output: number[] = [];
  for (const operation of operations)
    output.push(await operationService.calculate(operation));

  // Showing the output.
  console.log(output.join("\n"));
};

main();
