const rates = require("./rates");
const supported = Object.keys(rates);

function validateRequest(body) {
  // 1. body must be a real object (not undefined, null, or an array)
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object";
  }

  // 2. all three fields must be present
  for (const field of ["from", "to", "amount"]) {
    if (body[field] === undefined) {
      return `Missing required field: ${field}`;
    }
  }

  // 3. types
  if (typeof body.from !== "string" || typeof body.to !== "string") {
    return "from and to must be strings";
  }
  if (typeof body.amount !== "number") {
    return "amount must be a number";
  }

  // 4. currencies must be supported (accept lowercase)
  for (const code of [body.from, body.to]) {
    if (!supported.includes(code.toUpperCase())) {
      return `Unsupported currency: ${code}. Supported currencies: ${supported.join(", ")}`;
    }
  }

  // 5. amount must be a positive, finite number
  if (!Number.isFinite(body.amount) || body.amount <= 0) {
    return "amount must be a positive number";
  }

  return null;
}

module.exports = { validateRequest };
