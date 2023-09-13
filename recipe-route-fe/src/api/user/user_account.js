import { getApiCall, postApiCall, putApiCall } from "../axiosConfig";

const BASE_API_URL = "/api/v1";
const USER_DETAILS_API = `${BASE_API_URL}/user`;
const USER_PREFERENCES_API = `${BASE_API_URL}/user/preferences`;
const USER_FAVORITE_API = `${USER_PREFERENCES_API}/favorite`;
const USER_CART_API = `${BASE_API_URL}/user-cart`;
const USER_SHOPPING_LIST_API = `${BASE_API_URL}/user/shopping-list`;
// const USER_ACTIVITY_API = `${USER_DETAILS_API}/activity`;
const USER_ORDER_API = `${USER_DETAILS_API}/orders`;

export const getUserDetailsAsync = async () => {
    try {
        const { data } = await getApiCall(USER_DETAILS_API);
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

export const updateUserPreferencesAsync = async (preferences) => {
    try {
        const { data } = await putApiCall(USER_PREFERENCES_API, preferences);
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

export const updateUserFavoritesAsync = async (recipeId) => {
    try {
        const { data } = await putApiCall(USER_FAVORITE_API, {
            recipe_id: recipeId,
        });
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

export const updateUserCartAsync = async (storeId, cartData) => {
    try {
        let payload = { store_id: storeId, cart_data: cartData };
        const { data } = await putApiCall(USER_CART_API, payload);
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data ??
                "Something went wrong. Please try again after sometime.",
            status: error.response?.status,
        };
    }
};

export const updateUserShoppingListAsync = async (shoppingList) => {
    try {
        const { data } = await putApiCall(USER_SHOPPING_LIST_API, {
            list: shoppingList,
        });
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data ??
                "Something went wrong. Please try again after sometime.",
            status: error.response?.status,
        };
    }
};

export const updateUserAsync = async (payload) => {
    try {
        const { data } = await putApiCall(USER_DETAILS_API, payload);
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data ??
                "Something went wrong. Please try again after sometime.",
            status: error.response?.status,
        };
    }
};

// export const getUserActivityAsync = async () => {
//     try {
//         const { data } = await getApiCall(USER_ACTIVITY_API);
//         return data;
//     } catch (error) {
//         return {
//             isError: true,
//             message:
//                 error?.response?.data?.error ??
//                 error?.response?.data?.message ??
//                 error.response?.data?.data ??
//                 "Something went wrong. Please try again after sometime.",
//             status: error.response?.status,
//         };
//     }
// };

export const getUserOrdersAsync = async () => {
    try {
        const { data } = await getApiCall(USER_ORDER_API);
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data ??
                "Something went wrong. Please try again after sometime.",
            status: error.response?.status,
        };
    }
};
