# FX Conversion API

A small REST API that converts a monetary amount from one currency to another using a fixed set of exchange rates, with CAD as the base currency.

## Tech Stack

* **Language & Framework:** Node.js / Express (CommonJS modules)
* **Storage:** None. Exchange rates are static data in `src/rates.js`.
* **Testing:** Jest and Supertest

## Getting Started

### Prerequisites

* Node.js v20 or newer

### Installation & Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/TheAlexTanasescu/fx-conversion-api.git
   cd fx-conversion-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000`. Set the `PORT` environment variable to use a different port (for example, `PORT=3001 npm start`).

## Running Tests

```bash
npm test
```

This runs 33 tests: unit tests for the converter and the validator, and integration tests that call the API endpoint through Supertest.

## API

### `POST /convert`

Converts an amount between any two supported currencies: `CAD`, `USD`, `EUR`, `GBP`, `AUD`, `JPY`. Currency codes are case-insensitive.

**Request body**

| Field | Type | Description |
| :--- | :--- | :--- |
| `from` | string | Currency code to convert from |
| `to` | string | Currency code to convert to |
| `amount` | number | Amount to convert. Must be greater than 0 |

**Example request**

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"from": "CAD", "to": "USD", "amount": 100}'
```

**Example response (`200 OK`)**

```json
{
  "from": "CAD",
  "to": "USD",
  "originalAmount": 100,
  "convertedAmount": 72,
  "exchangeRate": 0.72
}
```

**Example error (`400 Bad Request`)**

```json
{
  "error": "Unsupported currency: XYZ. Supported currencies: CAD, USD, EUR, GBP, AUD, JPY"
}
```

### Status codes

| Status | When |
| :--- | :--- |
| `200` | Successful conversion |
| `400` | Invalid input (missing field, wrong type, unsupported currency, non-positive amount) or malformed JSON |
| `404` | Unknown route |
| `405` | Wrong HTTP method on `/convert` (response includes an `Allow: POST` header) |
| `500` | Unexpected server error (generic message, no internal details exposed) |

All error responses are JSON in the form `{ "error": "<message>" }`.

## Architecture & Design Decisions

* **Separation of concerns:** The conversion math (`src/converter.js`), request validation (`src/validate.js`) and the HTTP layer (`src/app.js`) are separate modules. The converter and validator are pure functions with no HTTP code, so they are easy to unit test. `app.js` exports the Express app without starting it, and `server.js` only calls `listen`, so the integration tests can use Supertest without opening a port.
* **Cross-rates through CAD:** All rates are relative to CAD, so converting between any pair uses `rate[to] / rate[from]`. This works for every combination without storing a table of pairs.
* **Rounding:** Converted amounts are rounded to 2 decimal places and exchange rates to 6. The amount is calculated from the unrounded rate, and only the final values are rounded, so rounding errors do not compound.
* **Input validation:** Checks run in a fixed order (body is an object, fields present, types correct, currencies supported, amount positive and finite), so each request gets the most specific error message. Lowercase currency codes are accepted and normalized to uppercase.
* **JSON numbers:** Amounts are returned as JSON numbers. JSON has no trailing zeros, so `72.00` is serialized as `72`. The value is the same.
* **Error handling:** Malformed JSON, unknown routes and wrong methods return JSON errors instead of Express's default HTML pages. Unexpected errors return a generic 500 message so stack traces are never leaked.

### Known limitations

* **JPY decimals:** Real JPY amounts have no decimal places. This API rounds every currency to 2 decimals for consistency with the example in the spec.
* **Rounding edge cases:** The rounding helper uses `Math.round` on a scaled value, so a few values may round down instead of up. (for example, `1.005`).
* **Rate precision:** Rounding rates to 6 decimals loses some precision on very small rates (such as JPY to GBP, about 0.005).

## Future Improvements

If given more time, I would prioritize:

* **Exact decimal arithmetic:** Use integer minor units or a decimal library for money, with per-currency decimal places (0 for JPY).
* **Live exchange rates:** Load rates from a provider or database instead of static data, with caching.
* **Documentation:** Add an OpenAPI/Swagger spec for the endpoint.
* **Operational hardening:** Request logging, rate limiting, and a Dockerfile for deployment.

## AI Disclosure

I used Claude (Anthropic) as a review tool during this exercise for parts I may have forgotten:

* **Code review:** I wrote the converter, rounding helper, validator logic and endpoint, anytime I was unsure of something Claude reviewed them and pointed out bugs, such as missing array handling in validation, case-sensitive currency checks, and wrong expected test values.
* **Code provided by Claude:** the static rates file and certain test cases I may have missed or not thought of.
* **Editor autocomplete:** my editor's inline AI suggested some test values, which were wrong. I checked every expected value by hand and corrected them.
