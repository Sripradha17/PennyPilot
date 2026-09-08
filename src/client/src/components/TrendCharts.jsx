import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Card from "./Card.jsx";

const COLORS = {
  income: "#1f7a6c",
  expenses: "#ff6b5e",
  savings: "#e8a23d",
  investment: "#5b3a8e",
};

function CurrencyTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-soft px-3 py-2 text-xs border border-mist">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {currency}
          {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function IncomeExpenseTrendChart({ data, currency }) {
  return (
    <Card>
      <h3 className="font-bold mb-3">Income vs. expenses (last {data.length} months)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: -10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={50} />
          <Tooltip content={<CurrencyTooltip currency={currency} />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke={COLORS.income}
            fill={COLORS.income}
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke={COLORS.expenses}
            fill={COLORS.expenses}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SavingsInvestmentTrendChart({ data, currency }) {
  return (
    <Card>
      <h3 className="font-bold mb-3">Savings &amp; investment growth over time</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ left: -10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={50} />
          <Tooltip content={<CurrencyTooltip currency={currency} />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="savingsCumulative"
            name="Savings (total)"
            stroke={COLORS.savings}
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="investmentCumulative"
            name="Investment (total)"
            stroke={COLORS.investment}
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
