import type { Expense } from "@/features/expenses/types";

export type CategoryBreakdownItem = {
  category: string;
  total: number;
};

export type MonthlyTrendItem = {
  month: string;
  total: number;
};

export type DashboardSummary = {
  totalExpenses: number;
  currentMonthExpenses: number;
  recentTransactions: Expense[];
  categoryBreakdown: CategoryBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
};
