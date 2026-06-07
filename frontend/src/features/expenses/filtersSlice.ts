import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ExpenseCategory, ExpenseFilters, ExpenseSort } from "./types";

const initialState: ExpenseFilters = {
  search: "",
  category: "all",
  month: "",
  sort: "date_desc"
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<ExpenseCategory | "all">) => {
      state.category = action.payload;
    },
    setMonth: (state, action: PayloadAction<string>) => {
      state.month = action.payload;
    },
    setSort: (state, action: PayloadAction<ExpenseSort>) => {
      state.sort = action.payload;
    },
    resetFilters: () => initialState
  }
});

export const { resetFilters, setCategory, setMonth, setSearch, setSort } =
  filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;
