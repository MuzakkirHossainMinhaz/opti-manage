import { baseApi } from "../../api/baseApi";

const ownershipRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOwnershipRequest: builder.mutation({
      query: (payload: { eyeGlassId: string; message?: string }) => ({
        url: "/ownership-requests",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OwnershipRequests"],
    }),
    getOwnershipRequests: builder.query({
      query: () => ({
        url: "/ownership-requests",
        method: "GET",
      }),
      providesTags: ["OwnershipRequests"],
    }),
    updateOwnershipRequestStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: "approved" | "rejected" | "cancelled" }) => ({
        url: `/ownership-requests/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["OwnershipRequests", "EyeGlasses"],
    }),
  }),
});

export const {
  useCreateOwnershipRequestMutation,
  useGetOwnershipRequestsQuery,
  useUpdateOwnershipRequestStatusMutation,
} = ownershipRequestApi;

