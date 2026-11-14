const express = require("express");
const { validateRequest } = require("./validate");
const { convert } = require("./converter");

const app = express();
app.use(express.json());

app.post("/convert", (req, res) => {
  const error = validateRequest(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const from = req.body.from.toUpperCase();
  const to = req.body.to.toUpperCase();
  const { amount } = req.body;

  const { convertedAmount, exchangeRate } = convert(from, to, amount);

  res.status(200).json({
    from,
    to,
    originalAmount: amount,
    convertedAmount,
    exchangeRate,
  });
});

module.exports = app;
