import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatCurrency } from "@/lib/constants";
import type { MonthlyTrendItem } from "../types";

type MonthlyTrendChartProps = {
  data: MonthlyTrendItem[];
};

const formatTooltipValue = (value: unknown) => formatCurrency(Number(value ?? 0));

export const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => (
  <ResponsiveContainer height="100%" width="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="month" fontSize={12} tickLine={false} />
      <YAxis fontSize={12} tickFormatter={(value) => `Rs ${value}`} />
      <Tooltip formatter={formatTooltipValue} />
      <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
