import { baseApi } from "../../api/baseApi";

const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSales: builder.mutation({
      query: (newSales) => ({
        url: "/sales/create",
        method: "POST",
        body: newSales,
      }),
      invalidatesTags: ["EyeGlasses", "Sales"],
    }),
    getAllSales: builder.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "/sales",
        method: "GET",
        params,
      }),
      providesTags: ["Sales"],
    }),
    getSaleById: builder.query({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),
  }),
});

export const { useCreateSalesMutation, useGetAllSalesQuery, useGetSaleByIdQuery } = salesApi;
