import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// mutation either post, put, patch and delete
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8085/api", 
    }),
    tagTypes: ["User"],
    endpoints: (build) => ({
        createUser: build.mutation({
            query: ({email, password}) => ({
                url: "/users",
                method: "POST",
                body: {email, password}
            }),
            invalidatesTags: ["User"]
        }),
        updateUser: build.mutation({
            query: ({id, body}) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: body
            }),
            invalidatesTags: ["User"]
        }),
        deleteUser: build.mutation({
            query: ({id}) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"]
        }),
        getUsers: build.query({
            query: () => {
                return {
                    url: "/users",
                    method: "GET",
                }
            },
            providesTags: ["User"]
        }),
        getUser: build.query({
            query: ({ id}) => {
                return {
                    url: `/users/${id}`,
                    method: "GET",
                }
            },
            providesTags: ["User"]
        })
    })

})

export const { useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation, useGetUserQuery, useGetUsersQuery } = userApi;