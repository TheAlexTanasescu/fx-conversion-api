const rates = require("./rates");

const convert = (fromCurrency, toCurrency, amount) => {
  const rawRate = rates[toCurrency] / rates[fromCurrency];
  return {
    convertedAmount: roundTo(amount * rawRate, 2),
    exchangeRate: roundTo(rawRate, 6),
  };
};

module.exports = { convert };

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
