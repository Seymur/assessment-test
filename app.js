const Bank = require("./bank");

// Add default transaction types, you can add extra transaction types with the same method
function addDefaultTransactionTypes(bank) {
  bank.addTransactionType("cash_in", function (transaction) {
    // We calculate commission for total amount
    // Commission must not be exceed 5.00 EUR
    const { amount } = transaction.operation;
    const commission_rate = 0.03;
    const commission_max_threshold = 5;
    const commission = (amount * commission_rate) / 100;
    return Math.min(commission, commission_max_threshold);
  });

  bank.addTransactionType("cash_out", function (transaction) {
    switch (transaction.user_type) {
      case "juridical": {
        const { amount } = transaction.operation;
        const commission_rate = 0.3;
        const commission_min_threshold = 0.5;
        const commission = (amount * commission_rate) / 100;
        return Math.max(commission, commission_min_threshold);
      }

      case "natural": {
        const { amount } = transaction.operation;
        const commission_rate = 0.3;
        const commissionFreeThreshold = 1000;
        const weeklyTransactionId =
          bank.generateWeeklyTransactionId(transaction);
        const totalWeeklyTransationAmount =
          bank.weeklyTransactions[weeklyTransactionId] || 0;

        let commissionEligibleAmount = 0;

        if (totalWeeklyTransationAmount - amount <= commissionFreeThreshold) {
          commissionEligibleAmount = Math.max(
            0,
            totalWeeklyTransationAmount - commissionFreeThreshold
          );
        } else {
          commissionEligibleAmount = amount;
        }

        const commission = (commissionEligibleAmount * commission_rate) / 100;

        return commission;
      }
    }
  });
}

function run(transactions) {
  const bank = new Bank();

  addDefaultTransactionTypes(bank);

  for (const transaction of transactions) {
    console.log(bank.executeTransaction(transaction));
  }
}

module.exports = { run, addDefaultTransactionTypes };
