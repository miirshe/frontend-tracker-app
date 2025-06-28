/* eslint-disable no-unused-vars */
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";
import { removeToken, removeUser } from "../../lib/utils";

export const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
    validateStatus: (res, body) => {
        if(res.status === 401){
            removeToken();
            removeUser();
            window.location.href = "/auth/login";
        }

        if(!res.ok){
            return false;
        }

        return true;
    }
});