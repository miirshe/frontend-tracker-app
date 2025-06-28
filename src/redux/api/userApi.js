import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

// mutation either post, put, patch and delete
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQuery,
    tagTypes: ["User"],
    endpoints: (build) => ({
        createUser: build.mutation({
            query: ({ username, email, password }) => ({
                url: "/users/register",
                method: "POST",
                body: { username, email, password }
            }),
            invalidatesTags: ["User"]
        }),
        loginUser: build.mutation({
            query: ({ email, password }) => ({
                url: "/users/login", 
                method: "POST",
                body: { email, password }
            })
        }),
        updateUser: build.mutation({
            query: ({ id, ...body }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: body
            }),
            invalidatesTags: ["User"]
        }),
        deleteUser: build.mutation({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"]
        }),
        // Main query with aggregate pipeline for tables (maps to getAlUsers function)
        getUsers: build.query({
            query: (params = {}) => {
                const { 
                    page = 1, 
                    limit = 10, 
                    search = "", 
                    searchFields = "username,email,role",
                    sort = "createdAt:desc",
                    sortField = "createdAt",
                    sortOrder = "desc"
                } = params;
                
                const queryParams = new URLSearchParams();
                
                // Add pagination
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());
                
                // Add search
                if (search) {
                    queryParams.append('search', search);
                    queryParams.append('searchFields', searchFields);
                }
                
                // Add sorting (backend supports both formats)
                if (sort) {
                    queryParams.append('sort', sort);
                } else {
                    queryParams.append('sortField', sortField);
                    queryParams.append('sortOrder', sortOrder);
                }
                
                return {
                    url: `/users?${queryParams.toString()}`,
                    method: "GET",
                }
            },
            providesTags: ["User"]
        }),
        // Simple query for dropdowns and basic listings (matches backend getUsers)
        getUsersSimple: build.query({
            query: () => ({
                url: "/users",
                method: "GET",
            }),
            providesTags: ["User"]
        }),
        getUser: build.query({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: "GET",
            }),
            providesTags: ["User"]
        }),
        getUserStats: build.query({
            query: () => ({
                url: "/users/stats",
                method: "GET",
            }),
            providesTags: ["User"]
        })
    })
});

export const { 
    useCreateUserMutation, 
    useLoginUserMutation,
    useDeleteUserMutation, 
    useUpdateUserMutation, 
    useGetUserQuery, 
    useGetUsersQuery,
    useGetUserStatsQuery
} = userApi;