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

  test("converts 100 USD to EUR", () => {
    const result = convert("USD", "EUR", 100);

    expect(result.convertedAmount).toBe(91.67);
    expect(result.exchangeRate).toBe(0.916667);
  });

  test("converts 1000 JPY to GBP", () => {
    const result = convert("JPY", "GBP", 1000);

    expect(result.convertedAmount).toBe(5.21);
    expect(result.exchangeRate).toBe(0.005205);
  });

  test("converts 100 USD to CAD", () => {
    const result = convert("USD", "CAD", 100);

    expect(result.convertedAmount).toBe(138.89);
    expect(result.exchangeRate).toBe(1.388889);
  });

  test("converts 100 CAD to CAD", () => {
    const result = convert("CAD", "CAD", 100);

    expect(result.convertedAmount).toBe(100);
    expect(result.exchangeRate).toBe(1);
  });

  test("converts 33.33 CAD to USD", () => {
    const result = convert("CAD", "USD", 33.33);

    expect(result.convertedAmount).toBe(24);
    expect(result.exchangeRate).toBe(0.72);
  });
});
