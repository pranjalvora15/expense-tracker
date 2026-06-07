import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/constants";
import type { CategoryBreakdownItem } from "../types";

type CategoryBreakdownChartProps = {
  data: CategoryBreakdownItem[];
};

const chartColors = ["#2563eb", "#16a34a", "#f97316", "#dc2626", "#7c3aed"];
const formatTooltipValue = (value: unknown) => formatCurrency(Number(value ?? 0));

export const CategoryBreakdownChart = ({ data }: CategoryBreakdownChartProps) => (
  <ResponsiveContainer height="100%" width="100%">
    <PieChart>
      <Pie
        data={data}
        dataKey="total"
        innerRadius={62}
        nameKey="category"
        outerRadius={96}
        paddingAngle={2}
      >
        {data.map((entry, index) => (
          <Cell fill={chartColors[index % chartColors.length]} key={entry.category} />
        ))}
      </Pie>
      <Tooltip formatter={formatTooltipValue} />
    </PieChart>
  </ResponsiveContainer>
);
