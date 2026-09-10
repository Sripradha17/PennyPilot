import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
  income: "#4a9186",
  expenses: "#c9776b",
  savings: "#c99a52",
  investment: "#8a76ac",
};
const GRID_COLOR = "#2d2d36";
const AXIS_TICK = { fontSize: 12, fill: "#8b8b96" };
const LEGEND_STYLE = { fontSize: 12, color: "#b8b8c2" };

function CurrencyTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface2 rounded-lg shadow-soft px-3 py-2 text-xs border border-mist">
      <p className="font-semibold mb-1 text-ink">{label}</p>
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
      <h3 className="font-bold mb-3">Income vs. expenses by month</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ left: 0, right: 10 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="label" tick={AXIS_TICK} />
          <YAxis tick={AXIS_TICK} width={50} />
          <Tooltip content={<CurrencyTooltip currency={currency} />} cursor={{ fill: "#ffffff0d" }} />
          <Legend wrapperStyle={LEGEND_STYLE} />
          <Bar dataKey="income" name="Income" fill={COLORS.income} radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill={COLORS.expenses} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SavingsInvestmentTrendChart({ data, currency }) {
  return (
    <Card>
      <h3 className="font-bold mb-3">Savings &amp; investment growth over time</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ left: 0, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis dataKey="label" tick={AXIS_TICK} />
          <YAxis tick={AXIS_TICK} width={50} />
          <Tooltip content={<CurrencyTooltip currency={currency} />} />
          <Legend wrapperStyle={LEGEND_STYLE} />
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
