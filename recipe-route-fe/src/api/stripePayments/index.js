import { postApiCall } from "../axiosConfig";

const BASE_API_URL = "/api/v1";
const STRIPE_PAYMENT_URL = `${BASE_API_URL}/stripe-setup`;
const ORDER_PAYMENT_URL = `${BASE_API_URL}/orders/set-order`;

export const setupStripeAsync = async (amount) => {
    try {
        let { data } = await postApiCall(STRIPE_PAYMENT_URL, { amount });
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data ??
                "Try again after sometime.",
            status: error.response?.data?.status,
        };
    }
};

export const updateStripePaymentAsync = async (paymentId) => {
    try {
        let { data } = await postApiCall(ORDER_PAYMENT_URL, { paymentId });
        return data;
    } catch (error) {
        return {
            isError: true,
            message:
                error?.response?.data?.error ??
                error?.response?.data?.message ??
                error.response?.data?.data ??
                "Try again after sometime.",
            status: error.response?.data?.status,
        };
    }
};
