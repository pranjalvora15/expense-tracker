import { lazy, Suspense } from "react";
import { CalendarDays, IndianRupee, ReceiptText, Tags } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetDashboardSummaryQuery } from "@/features/dashboard/dashboardApi";
import { formatCurrency, formatDate } from "@/lib/constants";

const MonthlyTrendChart = lazy(() =>
  import("@/features/dashboard/components/MonthlyTrendChart").then((module) => ({
    default: module.MonthlyTrendChart
  }))
);
const CategoryBreakdownChart = lazy(() =>
  import("@/features/dashboard/components/CategoryBreakdownChart").then((module) => ({
    default: module.CategoryBreakdownChart
  }))
);

export const DashboardPage = () => {
  const { data, isLoading } = useGetDashboardSummaryQuery();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading dashboard...</p>;
  }

  const summary = data ?? {
    totalExpenses: 0,
    currentMonthExpenses: 0,
    recentTransactions: [],
    categoryBreakdown: [],
    monthlyTrend: []
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          A quick look at totals, categories, and recent transactions.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={IndianRupee}
          label="Total expenses"
          value={formatCurrency(summary.totalExpenses)}
        />
        <MetricCard
          icon={CalendarDays}
          label="This month"
          value={formatCurrency(summary.currentMonthExpenses)}
        />
        <MetricCard
          icon={ReceiptText}
          label="Recent transactions"
          value={String(summary.recentTransactions.length)}
        />
        <MetricCard
          icon={Tags}
          label="Categories used"
          value={String(summary.categoryBreakdown.length)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Monthly trend</CardTitle>
            <CardDescription>Expense totals grouped by month.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {summary.monthlyTrend.length ? (
              <Suspense fallback={<EmptyChart message="Loading chart..." />}>
                <MonthlyTrendChart data={summary.monthlyTrend} />
              </Suspense>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category breakdown</CardTitle>
            <CardDescription>Where the money is going.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {summary.categoryBreakdown.length ? (
              <Suspense fallback={<EmptyChart message="Loading chart..." />}>
                <CategoryBreakdownChart data={summary.categoryBreakdown} />
              </Suspense>
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription>Your latest expense entries.</CardDescription>
        </CardHeader>
        <CardContent>
          {summary.recentTransactions.length ? (
            <div className="divide-y rounded-md border">
              {summary.recentTransactions.map((expense) => (
                <div
                  className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={expense.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{expense.title}</p>
                      <Badge>{expense.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No expenses yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value
}: {
  icon: typeof IndianRupee;
  label: string;
  value: string;
}) => (
  <Card>
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  </Card>
);

const EmptyChart = ({ message = "Add expenses to see this chart." }: { message?: string }) => (
  <div className="flex h-full items-center justify-center rounded-md border border-dashed">
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);
