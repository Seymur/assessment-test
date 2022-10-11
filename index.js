const fs = require("fs");
const path = require("path");
const app = require("./app");

const inputDataFilePath = process.argv
  .find((arg) => arg.startsWith("inputFile="))
  .slice("inputFile=".length);

const fileBuffer = fs.readFileSync(path.join(__dirname, inputDataFilePath));
const transactionData = JSON.parse(fileBuffer.toString());

app.run(transactionData);
