import {
    getApiCall,
    postApiCall,
    postFileApiCall,
    putApiCall,
} from "../axiosConfig";

const BASE_API_URL = "/api/v1";
const getAllStoresAPI = (page) => `${BASE_API_URL}/stores?page=${page}`;
const getStoreInventoryAPI = (page) =>
    `${BASE_API_URL}/store-inventory?page=${page}`;
const STORE_ONBOARDING_UPLOAD = `${BASE_API_URL}/store-upload`;
const getStoreDetailsApi = (storeId) => `${BASE_API_URL}/store/${storeId}`;
const STORE_INVENTORY_API = `${BASE_API_URL}/store-inventory`;
const STORE_ORDER_API = `${BASE_API_URL}/store/orders`;

export const fetchStoresAsync = async (page = 1) => {
    try {
        const { data } = await getApiCall(getAllStoresAPI(page));
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.data?.status,
        };
    }
};

export const fetchStoreInventoryAsync = async (page = 1) => {
    try {
        const { data } = await getApiCall(getStoreInventoryAPI(page));
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.data?.status,
        };
    }
};

export const uploadOnboardingAsync = async (storeData) => {
    try {
        const { data } = await postFileApiCall(
            STORE_ONBOARDING_UPLOAD,
            storeData
        );
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.data?.status,
        };
    }
};

export const fetchStoreDetailsAsync = async (storeId) => {
    try {
        const { data } = await getApiCall(getStoreDetailsApi(storeId));
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.data?.status,
        };
    }
};

export const updateInventoryItemAsync = async (payload) => {
    try {
        const { data } = await putApiCall(STORE_INVENTORY_API, payload);
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.data?.status,
        };
    }
};

export const addInventoryItemAsync = async (payload) => {
    try {
        const { data } = await postApiCall(STORE_INVENTORY_API, payload);
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.data?.status,
        };
    }
};

export const getStoreOrdersAsync = async () => {
    try {
        const { data } = await getApiCall(STORE_ORDER_API);
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.data?.status,
        };
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const { data } = await putApiCall(STORE_ORDER_API, { id, status });
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data,
            status: error.response?.data?.status,
        };
    }
};
