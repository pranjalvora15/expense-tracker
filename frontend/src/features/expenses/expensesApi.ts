import { baseApi } from "@/lib/api";
import type { Expense, ExpenseFilters, ExpenseInput } from "./types";

const toQueryParams = (filters: ExpenseFilters) => {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.category !== "all") {
    params.set("category", filters.category);
  }

  if (filters.month) {
    params.set("month", filters.month);
  }

  params.set("sort", filters.sort);
  return params.toString();
};

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<{ expenses: Expense[] }, ExpenseFilters>({
      query: (filters) => {
        const query = toQueryParams(filters);
        return `/expenses${query ? `?${query}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.expenses.map((expense) => ({
                type: "Expense" as const,
                id: expense.id
              })),
              { type: "Expense", id: "LIST" }
            ]
          : [{ type: "Expense", id: "LIST" }]
    }),
    createExpense: builder.mutation<{ expense: Expense }, ExpenseInput>({
      query: (body) => ({
        url: "/expenses",
        method: "POST",
        body
      }),
      invalidatesTags: [
        { type: "Expense", id: "LIST" },
        { type: "Dashboard", id: "SUMMARY" }
      ]
    }),
    updateExpense: builder.mutation<
      { expense: Expense },
      { id: string; body: ExpenseInput }
    >({
      query: ({ id, body }) => ({
        url: `/expenses/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Expense", id: arg.id },
        { type: "Expense", id: "LIST" },
        { type: "Dashboard", id: "SUMMARY" }
      ]
    }),
    deleteExpense: builder.mutation<void, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [
        { type: "Expense", id: "LIST" },
        { type: "Dashboard", id: "SUMMARY" }
      ]
    })
  })
});

export const {
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpensesQuery,
  useUpdateExpenseMutation
} = expensesApi;
