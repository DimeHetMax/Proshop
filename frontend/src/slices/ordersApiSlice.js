import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";


export const ordersApiSLice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: "POST",
                body: { ...order },
            })
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`
            }),
            keepUnusedDataFor: 5
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: "PUT",
                body: { ...details }
            })
        }),
        getPayPalClintId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`
            }),
            keepUnusedDataFor: 5,
            providesTags: ["Orders"]
        }),
        getOrders: builder.query({
            query: ({ pageNumber }) => ({
                url: ORDERS_URL,
                params: {
                    pageNumber
                }
            }),
            keepUnusedDataFor: 5,
            providesTags: ["Orders"]
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: "PUT",

            })
        }),
        deleteOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Orders"]
        })
    })
});



export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClintIdQuery,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
    useDeleteOrderMutation
} = ordersApiSLice;
