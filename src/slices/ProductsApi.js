import { Api } from "./Api";

const ProductsApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (token) => ({
        url: "/product/get",
        headers: {
          "auth-token": token,
        },
      }),
      providesTags: ["Products"],
    }),
    addProduct: builder.mutation({
      query: ({ token, data }) => ({
        url: `/product/create`,
        headers: {
          "auth-token": token,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),
    //block user user
    deleteProduct: builder.mutation({
      query: ({ token, id }) => ({
        url: `/product/delete/${id}`,
        headers: {
          "auth-token": token,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    editProduct: builder.mutation({
      query: ({ token, id, data }) => ({
        url: `/product/update/${id}`,
        headers: {
          "auth-token": token,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetProductsQuery,
  useDeleteProductMutation,
  useEditProductMutation,
  useAddProductMutation,
} = ProductsApi;
