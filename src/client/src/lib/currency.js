// Free, no-API-key exchange rates (ECB-based, daily). Used only when the user
// explicitly logs a transaction in a foreign currency — the app still stores
// and sums everything in the household's base currency so every existing
// chart/budget/goal keeps working unchanged.
export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "SGD"];

export async function fetchExchangeRate(fromCode, toCode) {
  if (fromCode === toCode) return 1;
  const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${fromCode}&symbols=${toCode}`);
  if (!res.ok) throw new Error("Couldn't fetch an exchange rate right now");
  const data = await res.json();
  const rate = data.rates?.[toCode];
  if (!rate) throw new Error(`No rate available for ${fromCode} → ${toCode}`);
  return rate;
}
