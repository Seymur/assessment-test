const moment = require("moment");

class Bank {
  constructor() {
    // Transaction types that the bank supports
    this.transactionTypes = {};
    // For weekly transaction bookkeeping for each user and transaction type
    this.weeklyTransactions = {};
  }

  /**
   * Executes given transaction and updates weekly transaction balance
   * for each user id and transaction type and return transaction commission fee
   * rounded up, with precision to 2 decimal points in string format
   *
   * @param {Object} transaction
   * @returns {String} transactionCommission
   */
  executeTransaction(transaction) {
    const transactionId = this.generateWeeklyTransactionId(transaction);

    if (this.transactionTypes[transaction.type]) {
      if (this.weeklyTransactions[transactionId]) {
        this.weeklyTransactions[transactionId] += transaction.operation.amount;
      } else {
        this.weeklyTransactions[transactionId] = transaction.operation.amount;
      }

      const commission = this.transactionTypes[transaction.type](transaction);

      return (Math.ceil(commission * 100) / 100).toFixed(2);
    } else {
      throw new Error("This transaction type does not exist");
    }
  }

  /**
   * Adds new transaction type.
   * transactionFn is the callback that will be called
   * when this transaction type is executed
   *
   * @param {String} transactionType
   * @param {Function} transactionFn
   */
  addTransactionType(transactionType, transactionFn) {
    if (!this.transactionTypes[transactionType]) {
      this.transactionTypes[transactionType] = transactionFn;
    } else {
      throw new Error("This transaction type already exists");
    }
  }

  /**
   * Generate a unique id for each transaction week and user and transaction type
   *
   * @param {Object} transaction
   * @returns {String} transactionId
   */
  generateWeeklyTransactionId(transaction) {
    const transactionWeekMonday = moment(transaction.date)
      .startOf("isoWeek")
      .toString()
      .replaceAll(" ", "_");

    const transactionId = `${transaction.user_id}-${transaction.user_type}-${
      transaction.type
    }-${transactionWeekMonday.toString()}`;
    return transactionId;
  }
}

module.exports = Bank;
