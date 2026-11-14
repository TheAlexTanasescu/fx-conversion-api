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
});
