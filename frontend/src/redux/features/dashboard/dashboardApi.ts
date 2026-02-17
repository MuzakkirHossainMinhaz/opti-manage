import { baseApi } from "../../api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      providesTags: [],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;

