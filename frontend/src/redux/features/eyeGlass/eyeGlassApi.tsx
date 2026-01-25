import { baseApi } from "../../api/baseApi";

const eyeGlassApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEyeGlasses: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach((key) => {
          if (filters[key]) params.append(key, filters[key]);
        });
        return { url: "/eye-glasses", method: "GET", params };
      },
      providesTags: ["EyeGlasses"],
    }),
    getEyeGlass: builder.query({
      query: (id) => ({
        url: `/eye-glasses/${id}`,
        method: "GET",
      }),
      providesTags: ["EyeGlass"],
    }),
    createEyeGlass: builder.mutation({
      query: (newEyeGlass) => ({
        url: "/eye-glasses/create",
        method: "POST",
        body: newEyeGlass,
      }),
      invalidatesTags: ["EyeGlasses", "EyeGlass"],
    }),
    deleteEyeGlass: builder.mutation({
      query: (eyeGlassIds) => ({
        url: `/eye-glasses`,
        method: "DELETE",
        body: { eyeGlassIds },
      }),
      invalidatesTags: ["EyeGlasses"],
    }),
    deleteAllEyeGlasses: builder.mutation({
      query: () => ({
        url: `/eye-glasses/delete-all`,
        method: "DELETE",
      }),
      invalidatesTags: ["EyeGlasses"],
    }),
    updateEyeGlass: builder.mutation({
      query: (updatedEyeGlass) => ({
        url: `/eye-glasses/${updatedEyeGlass._id}`,
        method: "PUT",
        body: updatedEyeGlass,
      }),
      invalidatesTags: ["EyeGlasses", "EyeGlass"],
    }),
  }),
});

export const {
  useGetAllEyeGlassesQuery,
  useGetEyeGlassQuery,
  useCreateEyeGlassMutation,
  useDeleteEyeGlassMutation,
  useDeleteAllEyeGlassesMutation,
  useUpdateEyeGlassMutation,
} = eyeGlassApi;
