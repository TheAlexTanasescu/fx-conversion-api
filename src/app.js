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

// 405: wrong method on /convert (must come AFTER the POST route)
app.all("/convert", (req, res) => {
  res.set("Allow", "POST");
  res.status(405).json({ error: "Method not allowed. Use POST." });
});

// 404: anything else (must come after all routes)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler (must be LAST, and must take four arguments)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON in request body" });
  }
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
