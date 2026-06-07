import { lazy, Suspense, useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { expenseCategories, formatCurrency, formatDate, sortOptions } from "@/lib/constants";
import { setCategory, setMonth, setSearch, setSort } from "../filtersSlice";
import {
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpensesQuery,
  useUpdateExpenseMutation
} from "../expensesApi";
import type { Expense, ExpenseCategory, ExpenseInput, ExpenseSort } from "../types";

const ExpenseFormDialog = lazy(() =>
  import("../components/ExpenseFormDialog").then((module) => ({
    default: module.ExpenseFormDialog
  }))
);

export const ExpensesPage = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { data, isFetching } = useGetExpensesQuery(filters);
  const [createExpense, createState] = useCreateExpenseMutation();
  const [updateExpense, updateState] = useUpdateExpenseMutation();
  const [deleteExpense, deleteState] = useDeleteExpenseMutation();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [viewExpense, setViewExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const expenses = data?.expenses ?? [];
  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const openCreate = () => {
    setSelectedExpense(null);
    setDialogOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setDialogOpen(true);
  };

  const handleSubmit = async (input: ExpenseInput) => {
    if (selectedExpense) {
      await updateExpense({ id: selectedExpense.id, body: input }).unwrap();
    } else {
      await createExpense(input).unwrap();
    }

    setDialogOpen(false);
    setSelectedExpense(null);
  };

  const handleDelete = async (expense: Expense) => {
    setDeleteTarget(expense);
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement | HTMLDivElement>,
    expense: Expense
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setViewExpense(expense);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await deleteExpense(deleteTarget.id).unwrap();
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, delete, search, and filter your expense history.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense history</CardTitle>
          <CardDescription>
            Showing {expenses.length} entries with a visible total of{" "}
            {formatCurrency(total)}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_180px_180px]">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  className="pl-9"
                  placeholder="Title or notes"
                  value={filters.search}
                  onChange={(event) => dispatch(setSearch(event.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  dispatch(setCategory(value as ExpenseCategory | "all"))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                type="month"
                value={filters.month}
                onChange={(event) => dispatch(setMonth(event.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Sort</Label>
              <Select
                value={filters.sort}
                onValueChange={(value) => dispatch(setSort(value as ExpenseSort))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden rounded-md border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow
                    className="cursor-pointer transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    key={expense.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setViewExpense(expense)}
                    onKeyDown={(event) => handleRowKeyDown(event, expense)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{expense.title}</p>
                        {expense.notes ? (
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {expense.notes}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{expense.category}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          aria-label="Edit expense"
                          size="icon"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEdit(expense);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          aria-label="Delete expense"
                          disabled={deleteState.isLoading}
                          size="icon"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(expense);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {expenses.map((expense) => (
              <div
                className="cursor-pointer rounded-md border p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                key={expense.id}
                role="button"
                tabIndex={0}
                onClick={() => setViewExpense(expense)}
                onKeyDown={(event) => handleRowKeyDown(event, expense)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <Badge>{expense.category}</Badge>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(event) => {
                        event.stopPropagation();
                        openEdit(expense);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      disabled={deleteState.isLoading}
                      size="icon"
                      variant="ghost"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(expense);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {expense.notes ? (
                  <p className="mt-2 text-sm text-muted-foreground">{expense.notes}</p>
                ) : null}
              </div>
            ))}
          </div>

          {!expenses.length ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {isFetching ? "Loading expenses..." : "No expenses found."}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Suspense fallback={null}>
        <ExpenseFormDialog
          expense={selectedExpense}
          isOpen={dialogOpen}
          isSaving={createState.isLoading || updateState.isLoading}
          onClose={() => {
            setDialogOpen(false);
            setSelectedExpense(null);
          }}
          onSubmit={handleSubmit}
        />
      </Suspense>

      <Dialog open={Boolean(viewExpense)} onOpenChange={(open) => !open && setViewExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewExpense?.title ?? "Expense details"}</DialogTitle>
            <DialogDescription>
              Complete information for this expense entry.
            </DialogDescription>
          </DialogHeader>
          {viewExpense ? (
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatCurrency(viewExpense.amount)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border p-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Category
                  </p>
                  <Badge className="mt-2">{viewExpense.category}</Badge>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Date
                  </p>
                  <p className="mt-2 text-sm font-medium">{formatDate(viewExpense.date)}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Created
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {formatDate(viewExpense.createdAt)}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Updated
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {formatDate(viewExpense.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs font-medium uppercase text-muted-foreground">Notes</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                  {viewExpense.notes || "No notes added."}
                </p>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewExpense(null)}>
              Close
            </Button>
            {viewExpense ? (
              <Button
                type="button"
                onClick={() => {
                  setSelectedExpense(viewExpense);
                  setViewExpense(null);
                  setDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
                Edit expense
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleteState.isLoading) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete expense?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.title ?? "this expense"}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={deleteState.isLoading}
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={deleteState.isLoading}
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              {deleteState.isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
