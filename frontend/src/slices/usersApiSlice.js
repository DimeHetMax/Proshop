import { USERS_URL } from "../constants"
import { apiSlice } from "./apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                // url: USERS_URL / auth,
                url: `${USERS_URL}/login`,
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data,
            })
        }),
        logout: builder.mutation({
            query: (data) => ({
                // url: USERS_URL / auth,
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data,
            })
        }),
        getUsers: builder.query({
            query: ({ pageNumber }) => ({
                url: `${USERS_URL}`,
                params: {
                    pageNumber
                }
            }),
            providesTags: ["Users"],
            keepUnusedDataFor: 5
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Users"]
        }),
        getUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`
            }),
            providesTags: (result, error, userId) => [{ type: "User", id: userId }],
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: ({ userId, ...data }) => ({
                url: `${USERS_URL}/${userId}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: (result, error, { userId }) => ["Users", { type: "User", id: userId }]
        })
    })
})


export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation
} = usersApiSlice;