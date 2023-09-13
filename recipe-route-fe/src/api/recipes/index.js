import { getApiCall, postApiCall } from "../axiosConfig";

const BASE_API_URL = "/api/v1";
const getRecipeDetailsUrl = (recipeId) => `${BASE_API_URL}/recipe/${recipeId}`;
const getRecipeApiUrl = (pageNo) => `${BASE_API_URL}/recipes?page=${pageNo}`;

export const getPersonalizedRecipesAsync = async (page) => {
    try {
        const { data } = await getApiCall(getRecipeApiUrl(page));
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

export const getRecipeDetailsAsync = async (recipeId) => {
    try {
        const { data } = await getApiCall(getRecipeDetailsUrl(recipeId));
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
