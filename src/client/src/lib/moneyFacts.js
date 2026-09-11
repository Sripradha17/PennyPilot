// Short, evergreen budgeting facts/rules of thumb — real, well-established
// personal-finance concepts (not fabricated statistics), rotated by
// MoneyFactCard to give the app some personality beyond raw numbers.
export const MONEY_FACTS = [
  "The 50/30/20 rule: roughly 50% of income to needs, 30% to wants, and 20% to savings or debt payoff.",
  "Irregular expenses — car repairs, annual renewals, gifts — are the most common budget-buster, because they're easy to forget month to month.",
  "A subscription you forgot about is still money leaving your account. A quick quarterly review often finds easy savings.",
  "Paying yourself first — moving money to savings the moment you're paid, before spending — tends to work better than saving whatever's left.",
  "Tracking every expense for even one month makes people spend differently — awareness alone changes behavior.",
  "An emergency fund of 3–6 months of expenses is the traditional benchmark, but even one month makes a real difference.",
  "Categorizing spending by 'need' vs 'want' is more useful than tracking by store — it shows where flexibility actually exists.",
  "Small recurring charges compound: a $12/month subscription is $144/year — the same as several one-time purchases people agonize over.",
  "Round-number prices ($19.99 instead of $20) are proven to reduce the mental friction of spending — which is exactly why they're everywhere.",
  "Reviewing your budget monthly, not just setting it once, is the single habit most correlated with actually sticking to one.",
];

export function factForIndex(i) {
  return MONEY_FACTS[i % MONEY_FACTS.length];
}
