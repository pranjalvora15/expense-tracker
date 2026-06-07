import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthState, User } from "./types";

const token = localStorage.getItem("expense_tracker_token");
const storedUser = localStorage.getItem("expense_tracker_user");

const initialState: AuthState = {
  token,
  user: storedUser ? (JSON.parse(storedUser) as User) : null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("expense_tracker_token", action.payload.token);
      localStorage.setItem("expense_tracker_user", JSON.stringify(action.payload.user));
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("expense_tracker_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("expense_tracker_token");
      localStorage.removeItem("expense_tracker_user");
    }
  }
});

export const { logout, setCredentials, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
