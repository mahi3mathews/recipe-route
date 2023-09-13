import { postApiCall } from "../axiosConfig";

const BASE_API_URL = "/api/v1";
const LOGIN_API_URL = `${BASE_API_URL}/login`;
const STORE_LOGIN_API_URL = `${BASE_API_URL}/store-login`;
const REGISTER_USER_API_URL = `${BASE_API_URL}/register-user`;
const REGISTER_STORE_API_URL = `${BASE_API_URL}/register-store`;
const LOGOUT_URL = `${BASE_API_URL}/logout`;

export const loginAsync = async (userDetails, isStore) => {
    try {
        const { data } = await postApiCall(
            isStore ? STORE_LOGIN_API_URL : LOGIN_API_URL,
            userDetails
        );
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error?.response?.data?.status,
        };
    }
};

export const logoutAsync = async (userDetails) => {
    try {
        const { data } = await postApiCall(LOGOUT_URL, userDetails);
        return { isLoggedOut: true };
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error?.response?.status,
        };
    }
};

export const registerUserAsync = async (userDetails) => {
    try {
        let api = REGISTER_USER_API_URL;
        const { data } = await postApiCall(api, userDetails);

        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.status,
        };
    }
};

export const registerStoreAsync = async (userDetails) => {
    try {
        const { data } = await postApiCall(REGISTER_STORE_API_URL, userDetails);
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.status,
        };
    }
};
