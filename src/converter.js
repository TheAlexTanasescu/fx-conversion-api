const rates = require("./rates");

const convert = (fromCurrency, toCurrency, amount) => {
  const exchangeRate = rates[toCurrency] / rates[fromCurrency];
  return {
    convertedAmount: amount * exchangeRate,
    exchangeRate,
  };
};

module.exports = { convert };
