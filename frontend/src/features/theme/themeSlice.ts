import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
};

const storedTheme = localStorage.getItem("expense_tracker_theme") as ThemeMode | null;

const initialState: ThemeState = {
  mode: storedTheme ?? "light"
};

const applyTheme = (mode: ThemeMode) => {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem("expense_tracker_theme", mode);
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      applyTheme(action.payload);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      applyTheme(state.mode);
    }
  }
});

applyTheme(initialState.mode);

export const { setTheme, toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
