import { z } from "zod";
import { expenseCategories } from "../models/Expense.js";

const dateString = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

const expenseBody = z.object({
  title: z.string().trim().min(2).max(120),
  amount: z.coerce.number().positive(),
  category: z.enum(expenseCategories),
  date: dateString,
  notes: z.string().trim().max(500).optional().default("")
});

export const listExpensesSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    category: z.enum(expenseCategories).optional(),
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Month must use YYYY-MM format")
      .optional(),
    sort: z.enum(["date_desc", "date_asc", "amount_desc", "amount_asc"]).optional()
  })
});

export const createExpenseSchema = z.object({
  body: expenseBody
});

export const updateExpenseSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid expense id")
  }),
  body: expenseBody
});

export const expenseIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid expense id")
  })
});
