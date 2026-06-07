import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/authSlice";
import { filtersReducer } from "@/features/expenses/filtersSlice";
import { themeReducer } from "@/features/theme/themeSlice";
import { baseApi } from "@/lib/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    theme: themeReducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
