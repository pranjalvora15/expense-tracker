import { FormEvent, useEffect, useState } from "react";
import { expenseCategories } from "@/lib/constants";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import type { Expense, ExpenseCategory, ExpenseInput } from "../types";

type ExpenseFormDialogProps = {
  expense: Expense | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (input: ExpenseInput) => Promise<void>;
};

const today = () => new Date().toISOString().slice(0, 10);

export const ExpenseFormDialog = ({
  expense,
  isOpen,
  isSaving,
  onClose,
  onSubmit
}: ExpenseFormDialogProps) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food" as ExpenseCategory,
    date: today(),
    notes: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title,
        amount: String(expense.amount),
        category: expense.category,
        date: new Date(expense.date).toISOString().slice(0, 10),
        notes: expense.notes ?? ""
      });
    } else {
      setForm({
        title: "",
        amount: "",
        category: "Food",
        date: today(),
        notes: ""
      });
    }
    setError("");
  }, [expense, isOpen]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(form.amount);

    if (!form.title.trim() || amount <= 0 || Number.isNaN(amount)) {
      setError("Enter a title and an amount greater than zero.");
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      amount,
      category: form.category,
      date: form.date,
      notes: form.notes.trim()
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Edit expense" : "Add expense"}</DialogTitle>
          <DialogDescription>
            Keep the details short and clear for easier review later.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                maxLength={120}
                minLength={2}
                required
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                min="0.01"
                step="0.01"
                type="number"
                required
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    category: value as ExpenseCategory
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                required
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                maxLength={500}
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, notes: event.target.value }))
                }
              />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
