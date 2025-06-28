import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const taskApi = createApi({
    reducerPath: "taskApi",
    baseQuery: baseQuery,
    tagTypes: ["Task"],
    endpoints: (build) => ({
        createTask: build.mutation({
            query: ({ title, description, project, assignedTo, priority, dueDate }) => ({
                url: "/tasks",
                method: "POST",
                body: { title, description, project, assignedTo, priority, dueDate }
            }),
            invalidatesTags: ["Task"]
        }),
        updateTask: build.mutation({
            query: ({ id, ...body }) => ({
                url: `/tasks/${id}`,
                method: "PATCH",
                body: body
            }),
            invalidatesTags: ["Task"]
        }),
        deleteTask: build.mutation({
            query: ({ id }) => ({
                url: `/tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Task"]
        }),
        assignTask: build.mutation({
            query: ({ id, assignedTo }) => ({
                url: `/tasks/${id}/assign`,
                method: "PATCH",
                body: { assignedTo }
            }),
            invalidatesTags: ["Task"]
        }),
        assignMultipleTasks: build.mutation({
            query: ({ taskIds, assignedTo }) => ({
                url: "/tasks/assign-multiple",
                method: "POST",
                body: { taskIds, assignedTo }
            }),
            invalidatesTags: ["Task"]
        }),
        getTasks: build.query({
            query: (params = {}) => {
                const { 
                    page = 1, 
                    limit = 10, 
                    search = "", 
                    searchFields = "title,description,status,priority",
                    sort = "createdAt:desc",
                    project,
                    status,
                    assignedTo,
                    priority,
                    dueDateFrom,
                    dueDateTo,
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
                
                if (project) queryParams.append('project', project);
                if (status) queryParams.append('status', status);
                if (assignedTo) queryParams.append('assignedTo', assignedTo);
                if (priority) queryParams.append('priority', priority);
                if (dueDateFrom) queryParams.append('dueDateFrom', dueDateFrom);
                if (dueDateTo) queryParams.append('dueDateTo', dueDateTo);
                
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value.toString());
                    }
                });
                
                return {
                    url: `/tasks?${queryParams.toString()}`,
                    method: "GET",
                }
            },
            providesTags: ["Task"]
        }),
        getTask: build.query({
            query: ({ id }) => ({
                url: `/tasks/${id}`,
                method: "GET",
            }),
            providesTags: ["Task"]
        }),
        getTasksByProject: build.query({
            query: ({ projectId }) => ({
                url: `/tasks/project/${projectId}`,
                method: "GET",
            }),
            providesTags: ["Task"]
        }),
        getTasksByUser: build.query({
            query: ({ userId, status }) => {
                const queryParams = new URLSearchParams();
                if (status) queryParams.append('status', status);
                
                return {
                    url: `/tasks/user/${userId}?${queryParams.toString()}`,
                    method: "GET",
                }
            },
            providesTags: ["Task"]
        }),
        getTaskStats: build.query({
            query: () => ({
                url: "/tasks/stats",
                method: "GET",
            }),
            providesTags: ["Task"]
        })
    })
});

export const { 
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useAssignTaskMutation,
    useAssignMultipleTasksMutation,
    useGetTasksQuery,
    useGetTaskQuery,
    useGetTasksByProjectQuery,
    useGetTasksByUserQuery,
    useGetTaskStatsQuery
} = taskApi;