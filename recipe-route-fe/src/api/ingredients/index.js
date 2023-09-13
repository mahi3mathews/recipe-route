import { getApiCall, postApiCall } from "../axiosConfig";

const BASE_API_URL = "/api/v1";
const getIngredientListApi = (type) =>
    `${BASE_API_URL}/ingredient-list${type ? `?type=${type}` : ""}`;

export const getIngredientsAsync = async (type) => {
    try {
        const { data } = await getApiCall(getIngredientListApi(type));
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
