import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { Expense, ExpenseDocument } from "../models/Expense.js";
import { HttpError } from "../utils/httpError.js";

const toExpenseResponse = (expense: ExpenseDocument) => ({
  id: String(expense._id),
  title: expense.title,
  amount: expense.amount,
  category: expense.category,
  date: expense.date,
  notes: expense.notes,
  createdAt: expense.createdAt,
  updatedAt: expense.updatedAt
});

const getMonthRange = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));

  return { start, end };
};

export const listExpenses = async (req: Request, res: Response) => {
  const { search, category, month, sort = "date_desc" } = req.query as {
    search?: string;
    category?: string;
    month?: string;
    sort?: string;
  };

  const filter: FilterQuery<ExpenseDocument> = {
    userId: req.user?.id
  };

  if (category) {
    filter.category = category;
  }

  if (month) {
    const { start, end } = getMonthRange(month);
    filter.date = { $gte: start, $lt: end };
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const sortMap = {
    date_desc: { date: -1, createdAt: -1 },
    date_asc: { date: 1, createdAt: 1 },
    amount_desc: { amount: -1, date: -1 },
    amount_asc: { amount: 1, date: -1 }
  } as const;

  const expenses = await Expense.find(filter)
    .sort(sortMap[sort as keyof typeof sortMap])
    .lean();

  res.json({
    expenses: expenses.map((expense) => ({
      id: String(expense._id),
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt
    }))
  });
};

export const createExpense = async (req: Request, res: Response) => {
  const expense = await Expense.create({
    ...req.body,
    date: new Date(req.body.date),
    userId: req.user?.id
  });

  res.status(201).json({ expense: toExpenseResponse(expense) });
};

export const updateExpense = async (req: Request, res: Response) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?.id },
    {
      ...req.body,
      date: new Date(req.body.date)
    },
    { new: true, runValidators: true }
  );

  if (!expense) {
    throw new HttpError(404, "Expense not found");
  }

  res.json({ expense: toExpenseResponse(expense) });
};

export const deleteExpense = async (req: Request, res: Response) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?.id
  });

  if (!expense) {
    throw new HttpError(404, "Expense not found");
  }

  res.status(204).send();
};
