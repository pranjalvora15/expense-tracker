import { baseApi } from "@/lib/api";
import type { DashboardSummary } from "./types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => "/dashboard/summary",
      providesTags: [{ type: "Dashboard", id: "SUMMARY" }]
    })
  })
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
