const { validateRequest } = require("../src/validate");

describe("validateRequest", () => {
  test("returns null for a valid request", () => {
    expect(validateRequest({ from: "CAD", to: "USD", amount: 100 })).toBeNull();
  });

  test("accepts lowercase currency codes", () => {
    expect(validateRequest({ from: "usd", to: "eur", amount: 100 })).toBeNull();
  });

  test("rejects a missing body", () => {
    expect(validateRequest(undefined)).toContain("JSON object");
  });

  test("rejects a null body", () => {
    expect(validateRequest(null)).toContain("JSON object");
  });

  test("rejects an array body", () => {
    expect(validateRequest([])).toContain("JSON object");
  });

  test("rejects a request with no from", () => {
    expect(validateRequest({ to: "USD", amount: 100 })).toContain(
      "Missing required field: from",
    );
  });

  test("rejects a request with no to", () => {
    expect(validateRequest({ from: "CAD", amount: 100 })).toContain(
      "Missing required field: to",
    );
  });

  test("rejects a request with no amount", () => {
    expect(validateRequest({ from: "CAD", to: "USD" })).toContain(
      "Missing required field: amount",
    );
  });

  test("rejects a currency code that is not a string", () => {
    expect(validateRequest({ from: 123, to: "USD", amount: 100 })).toContain(
      "must be strings",
    );
  });

  test("rejects an amount sent as a string", () => {
    expect(
      validateRequest({ from: "CAD", to: "USD", amount: "100" }),
    ).toContain("amount must be a number");
  });

  test("rejects an unsupported currency and lists the supported ones", () => {
    const message = validateRequest({ from: "XYZ", to: "USD", amount: 100 });

    expect(message).toContain("Unsupported currency: XYZ");
    expect(message).toContain("Supported currencies");
  });

  test("rejects an amount of zero", () => {
    expect(validateRequest({ from: "CAD", to: "USD", amount: 0 })).toContain(
      "positive",
    );
  });

  test("rejects a negative amount", () => {
    expect(validateRequest({ from: "CAD", to: "USD", amount: -5 })).toContain(
      "positive",
    );
  });

  test("rejects NaN as an amount", () => {
    expect(validateRequest({ from: "CAD", to: "USD", amount: NaN })).toContain(
      "positive",
    );
  });
});
