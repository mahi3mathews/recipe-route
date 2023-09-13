import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderList: [],
};

const orderSlice = createSlice({
    initialState,
    name: "orders",
    reducers: {
        setOrderList: (state, action) => {
            state.orderList = [...action?.payload];
        },
        resetOrder: () => initialState,
    },
});

export const { resetOrder, setOrderList } = orderSlice.actions;
export default orderSlice.reducer;
