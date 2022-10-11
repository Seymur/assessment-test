const Bank = require("./bank");
const app = require("./app");

describe("Bank", () => {
  let bank;

  beforeAll(() => {
    bank = new Bank();
  });

  test("should add a new transaction type", () => {
    app.addDefaultTransactionTypes(bank);

    expect(bank.transactionTypes["cash_in"]).toBeTruthy();
    expect(bank.transactionTypes["cash_out"]).toBeTruthy();
  });

  test("should throw while adding existing transaction type", () => {
    expect(() => bank.addTransactionType("cash_in", function () {})).toThrow(
      "This transaction type already exists"
    );
  });

  test("should execute transaction for cashout for natural people with amount over weekly limit of 1000", () => {
    const transaction = {
      date: "2016-01-06",
      user_id: 1,
      user_type: "natural",
      type: "cash_out",
      operation: { amount: 30000, currency: "EUR" },
    };

    const commission = bank.executeTransaction(transaction);

    expect(commission).toEqual("87.00");
  });

  test("should execute transaction for cashout for natural people with amount under weekly limit of 1000", () => {
    const transaction = {
      date: "2016-01-07",
      user_id: 1,
      user_type: "natural",
      type: "cash_out",
      operation: { amount: 100.0, currency: "EUR" },
    };

    const commission = bank.executeTransaction(transaction);

    expect(commission).toEqual("0.30");
  });

  test("should execute transaction for cashin", () => {
    const transaction = {
      date: "2016-01-05",
      user_id: 1,
      user_type: "natural",
      type: "cash_in",
      operation: { amount: 200.0, currency: "EUR" },
    };

    const commission = bank.executeTransaction(transaction);

    expect(commission).toEqual("0.06");
  });

  test("commission fee should not exceed 5 EUR for cashin", () => {
    const transaction = {
      date: "2016-01-10",
      user_id: 2,
      user_type: "juridical",
      type: "cash_in",
      operation: { amount: 1000000.0, currency: "EUR" },
    };

    const commission = bank.executeTransaction(transaction);

    expect(commission).toEqual("5.00");
  });

  test("should generate weekly transaction id", () => {
    const bank = new Bank();
    const transaction = {
      date: "2016-01-05",
      user_id: 1,
      user_type: "natural",
      type: "cash_in",
      operation: { amount: 200.0, currency: "EUR" },
    };
    const transactionId = bank.generateWeeklyTransactionId(transaction);
    expect(transactionId).toEqual(
      "1-natural-cash_in-Mon_Jan_04_2016_00:00:00_GMT+0400"
    );
  });
});
