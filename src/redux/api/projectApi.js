import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: baseQuery,
    tagTypes: ["Project"],
    endpoints: (build) => ({
        createProject: build.mutation({
            query: ({ name, description, members }) => ({
                url: "/projects",
                method: "POST",
                body: { name, description, members }
            }),
            invalidatesTags: ["Project"]
        }),
        updateProject: build.mutation({
            query: ({ id, ...body }) => ({
                url: `/projects/${id}`,
                method: "PATCH",
                body: body
            }),
            invalidatesTags: ["Project"]
        }),
        deleteProject: build.mutation({
            query: ({ id }) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"]
        }),
        getProjects: build.query({
            query: (params = {}) => {
                const { 
                    page = 1, 
                    limit = 10, 
                    search = "", 
                    searchFields = "name,description,status",
                    sort = "createdAt:desc",
                    status,
                    ...filters 
                } = params;
                
                const queryParams = new URLSearchParams();
                
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());
                
                if (search) {
                    queryParams.append('search', search);
                    queryParams.append('searchFields', searchFields);
                }
                
                if (sort) {
                    queryParams.append('sort', sort);
                }
                
                if (status) {
                    queryParams.append('status', status);
                }
                
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value.toString());
                    }
                });
                
                return {
                    url: `/projects?${queryParams.toString()}`,
                    method: "GET",
                }
            },
            providesTags: ["Project"]
        }),
        getProject: build.query({
            query: ({ id }) => ({
                url: `/projects/${id}`,
                method: "GET",
            }),
            providesTags: ["Project"]
        }),
        getProjectStats: build.query({
            query: () => ({
                url: "/projects/stats",
                method: "GET",
            }),
            providesTags: ["Project"]
        })
    })
});

export const { 
    useCreateProjectMutation, 
    useUpdateProjectMutation,
    useDeleteProjectMutation, 
    useGetProjectsQuery,
    useGetProjectQuery,
    useGetProjectStatsQuery
} = projectApi;