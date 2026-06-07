import { expenseCategories, sortOptions } from "@/lib/constants";

export type ExpenseCategory = (typeof expenseCategories)[number];
export type ExpenseSort = (typeof sortOptions)[number]["value"];

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseInput = {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
};

export type ExpenseFilters = {
  search: string;
  category: ExpenseCategory | "all";
  month: string;
  sort: ExpenseSort;
};
