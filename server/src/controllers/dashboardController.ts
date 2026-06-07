import { Request, Response } from "express";
import { Expense } from "../models/Expense.js";

const startOfCurrentMonth = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};

export const getDashboardSummary = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const currentMonthStart = startOfCurrentMonth();

  const [
    totalResult,
    currentMonthResult,
    recentTransactions,
    categoryBreakdown,
    monthlyTrend
  ] = await Promise.all([
    Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    Expense.aggregate([
      { $match: { userId, date: { $gte: currentMonthStart } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    Expense.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(5).lean(),
    Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, category: "$_id", total: 1 } }
    ]),
    Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: "$_id", total: 1 } }
    ])
  ]);

  res.json({
    totalExpenses: totalResult[0]?.total ?? 0,
    currentMonthExpenses: currentMonthResult[0]?.total ?? 0,
    recentTransactions: recentTransactions.map((expense) => ({
      id: String(expense._id),
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt
    })),
    categoryBreakdown,
    monthlyTrend
  });
};
