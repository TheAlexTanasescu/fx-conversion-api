const request = require("supertest");
const app = require("../src/app");

describe("POST /convert", () => {
  test("converts CAD to USD", async () => {
    const response = await request(app)
      .post("/convert")
      .send({ from: "CAD", to: "USD", amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      from: "CAD",
      to: "USD",
      originalAmount: 100,
      convertedAmount: 72,
      exchangeRate: 0.72,
    });
  });

  test("converts between two non-CAD currencies", async () => {
    const response = await request(app)
      .post("/convert")
      .send({ from: "EUR", to: "USD", amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      from: "EUR",
      to: "USD",
      originalAmount: 100,
      convertedAmount: 109.09,
      exchangeRate: 1.090909,
    });
  });

  test("accepts lowercase currency codes", async () => {
    const response = await request(app)
      .post("/convert")
      .send({ from: "cad", to: "usd", amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      from: "CAD",
      to: "USD",
      originalAmount: 100,
      convertedAmount: 72,
      exchangeRate: 0.72,
    });
  });

  test("returns 400 with a message for an unsupported currency", async () => {
    const response = await request(app)
      .post("/convert")
      .send({ from: "XYZ", to: "USD", amount: 100 });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Unsupported currency: XYZ");
  });

  test("returns 400 with a message for a missing amount", async () => {
    const response = await request(app)
      .post("/convert")
      .send({ from: "CAD", to: "USD" });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Missing required field: amount");
  });

  test("returns 400 with a message for an amount sent as a string", async () => {
    const response = await request(app)
      .post("/convert")
      .send({ from: "CAD", to: "USD", amount: "100" });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("amount must be a number");
  });

  test("returns 400 with a message for a negative amount", async () => {
    const response = await request(app)
      .post("/convert")
      .send({ from: "CAD", to: "USD", amount: -100 });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("amount must be a positive number");
  });
});
