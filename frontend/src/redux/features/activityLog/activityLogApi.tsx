import { baseApi } from "../../api/baseApi";

const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query({
      query: () => ({
        url: "/activity-logs",
        method: "GET",
      }),
      providesTags: ["ActivityLogs"],
    }),
  }),
});

export const { useGetActivityLogsQuery } = activityLogApi;
