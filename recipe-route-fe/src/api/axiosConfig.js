import axios from "axios";
import { LOGOUT_URL } from "../constants/route_urls";

// Setting up the configuration for all API calls.

const authApiCall = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

authApiCall.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 403) {
            window.location.href = LOGOUT_URL;
        }
        return Promise.reject(error);
    }
);

export const postApiCall = (url, requestBody) => {
    return authApiCall.post(url, requestBody).then((res) => res);
};
export const getApiCall = (url) => authApiCall.get(url).then((res) => res);

export const putApiCall = (url, requestBody) =>
    authApiCall.put(url, requestBody).then((res) => res);

export const deleteApiCall = (url) =>
    authApiCall.delete(url).then((res) => res);

export const postFileApiCall = (url, requestBody) =>
    authApiCall
        .post(url, requestBody, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => res);
