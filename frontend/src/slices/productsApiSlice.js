import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
// "/api/products"
import { apiSlice } from "./apiSlice.js";
export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword, pageNumber, brand, category, minPrice, maxPrice }) => ({
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber,
                    brand,
                    category,
                    minPrice,
                    maxPrice
                }
            }),
            providesTags: ["Products"],
            keepUnusedDataFor: 5
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: "POST",
            }),
            invalidatesTags: ["Products"]
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Products"]
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: "POST",
                body: data
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: "DELETE",

            })
        }),
        createProductReviews: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Products"]
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`
            }),
            keepUnusedDataFor: 5,
        })
    }),

})
export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateProductReviewsMutation,
    useGetTopProductsQuery
} = productsApiSlice;