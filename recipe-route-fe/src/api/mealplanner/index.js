import { getApiCall, postApiCall } from "../axiosConfig";

const BASE_API_URL = "/api/v1";
const mealPlanUrl = (dateQuery) =>
    `${BASE_API_URL}/meal-plan?from_date=${dateQuery?.from}&to_date=${dateQuery?.to}`;

const ADD_RECIPE_MEAL_PLAN = `${BASE_API_URL}/meal-plan/add-recipe`;

export const getUserMealPlansAsync = async (dateQuery) => {
    try {
        const { data } = await getApiCall(mealPlanUrl(dateQuery));
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

export const addRecipeToPlanAsync = async (payload) => {
    try {
        const { data } = await postApiCall(ADD_RECIPE_MEAL_PLAN, payload);
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
