import fs from "fs";
export interface Operation {
  date: String;
  user_id: number;
  user_type: "natural" | "juridical";
  type: "cash_in" | "cash_out";
  operation: {
    amount: number;
    currency: "EUR";
  };
}
const args = process.argv.slice(2);

if (args.length !== 1) {
  throw Error(
    "You should specify an input file for the script to work. for instance: node index.js input.json"
  );
}

const inputFileName = args[0];

const jsonContent = fs.readFileSync(inputFileName);
const data: Operation[] = JSON.parse(jsonContent.toString()); // parsed data from the JSON file
