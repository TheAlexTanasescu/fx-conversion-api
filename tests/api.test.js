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

  test("returns 400 with a JSON error for malformed JSON", async () => {
    const response = await request(app)
      .post("/convert")
      .set("Content-Type", "application/json")
      .send('{"from":');

    expect(response.status).toBe(400);
    expect(response.type).toMatch(/json/);
    expect(response.body.error).toContain("Malformed");
  });

  test("returns 400 with a message for an empty body", async () => {
    const response = await request(app).post("/convert");

    expect(response.status).toBe(400);
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.length).toBeGreaterThan(0);
  });

  test("returns 405 for the wrong method", async () => {
    const response = await request(app).get("/convert");

    expect(response.status).toBe(405);
    expect(response.type).toMatch(/json/);
    expect(response.headers.allow).toBe("POST");
  });
});

describe("unknown routes", () => {
  test("returns 404 with a JSON error", async () => {
    const response = await request(app).get("/nothing");

    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
    expect(response.body.error).toEqual(expect.any(String));
  });
});
