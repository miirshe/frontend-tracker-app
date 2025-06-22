import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { saveUser, setToken } from "../../lib/utils";

// mutation either post, put, patch and delete
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8085/api", 
    }),
    tagTypes: ["Auth"],
    endpoints: (build) => ({
        login: build.mutation({
            query: ({email, password}) => ({
                url: "/users/login",
                method: "POST",
                body: {email, password}
            }),
            invalidatesTags: ["Auth"],
            onQueryStarted: async (args, {queryFulfilled}) => {
                try {

                    const { data } = await queryFulfilled;
                    console.log("Data", data)
                    setToken(data?.token)
                    saveUser(data?.data)
                    
                } catch (error) {
                    console.log("Error", error)
                    throw new Error(error?.message)
                }
            }
        })
    })

})

export const { useLoginMutation } = authApi;