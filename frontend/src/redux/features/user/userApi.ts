import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: ({ id, data }: { id: string; data: { fullName?: string; username?: string; email?: string } }) => ({
        url: `/auth/${id}/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    changePassword: builder.mutation({
      query: ({ id, data }: { id: string; data: { currentPassword: string; newPassword: string } }) => ({
        url: `/auth/${id}/change-password`,
        method: "PATCH",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: "/auth/users",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/auth/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useUpdateProfileMutation, useChangePasswordMutation, useGetUsersQuery, useDeleteUserMutation } = userApi;
