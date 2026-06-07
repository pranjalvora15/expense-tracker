import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense
} from "../controllers/expenseController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createExpenseSchema,
  expenseIdSchema,
  listExpensesSchema,
  updateExpenseSchema
} from "../validators/expenseValidators.js";

export const expenseRoutes = Router();

expenseRoutes.use(requireAuth);

expenseRoutes.get("/", validate(listExpensesSchema), asyncHandler(listExpenses));
expenseRoutes.post("/", validate(createExpenseSchema), asyncHandler(createExpense));
expenseRoutes.put("/:id", validate(updateExpenseSchema), asyncHandler(updateExpense));
expenseRoutes.delete("/:id", validate(expenseIdSchema), asyncHandler(deleteExpense));
