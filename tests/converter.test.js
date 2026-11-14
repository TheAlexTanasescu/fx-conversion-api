// tests/converter.test.js
const { convert } = require("../src/converter");

describe("convert", () => {
  test("converts 100 CAD to USD", () => {
    const result = convert("CAD", "USD", 100);

    expect(result.convertedAmount).toBe(72);
    expect(result.exchangeRate).toBe(0.72);
  });
  test("converts 100 CAD to EUR", () => {
    const result = convert("CAD", "EUR", 100);

    expect(result.convertedAmount).toBe(66);
    expect(result.exchangeRate).toBe(0.66);
  });
  test("converts 100 CAD to JPY", () => {
    const result = convert("CAD", "JPY", 100);

    expect(result.convertedAmount).toBe(10950);
    expect(result.exchangeRate).toBe(109.5);
  });
  // Approximate comparison: converter doesn't round yet.
  test("converts 100 USD to EUR", () => {
    const result = convert("USD", "EUR", 100);

    expect(result.convertedAmount).toBeCloseTo(91.66667, 4);
    expect(result.exchangeRate).toBeCloseTo(0.9166667, 6);
  });

  test("converts 1000 JPY to GBP", () => {
    const result = convert("JPY", "GBP", 1000);

    expect(result.convertedAmount).toBeCloseTo(5.2055, 4);
    expect(result.exchangeRate).toBeCloseTo(0.0052055, 6);
  });

  test("converts 100 USD to CAD", () => {
    const result = convert("USD", "CAD", 100);

    expect(result.convertedAmount).toBeCloseTo(138.88889, 4);
    expect(result.exchangeRate).toBeCloseTo(1.3888889, 6);
  });

  test("converts 100 CAD to CAD", () => {
    const result = convert("CAD", "CAD", 100);

    expect(result.convertedAmount).toBe(100);
    expect(result.exchangeRate).toBe(1);
  });
});
