import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense
} from "../controllers/expenseController.js";
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

expenseRoutes.get("/", validate(listExpensesSchema), listExpenses);
expenseRoutes.post("/", validate(createExpenseSchema), createExpense);
expenseRoutes.put("/:id", validate(updateExpenseSchema), updateExpense);
expenseRoutes.delete("/:id", validate(expenseIdSchema), deleteExpense);
