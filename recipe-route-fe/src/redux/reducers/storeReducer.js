import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    storeDetails: {},
    inventory: [],
    totalInventory: 0,
    storeList: [],
    storeDetailList: {},
};

const storeSlice = createSlice({
    initialState,
    name: "stores",
    reducers: {
        setStoreDetails: (state, action) => {
            state.storeDetails = action?.payload;
        },
        updateStoreDetails: (state, action) => {
            state.storeDetails = { ...state.storeDetails, ...action?.payload };
        },
        setStoreInventory: (state, action) => {
            state.inventory = [...action.payload?.list];
            state.totalInventory = action.payload?.total_records;
        },
        setStoreList: (state, action) => {
            state.storeList = [...action.payload?.list];
            state.storesTotalRecords = action?.payload?.total_records;
        },
        setStoresDetailList: (state, action) => {
            state.storeDetailList = {
                ...state.storeDetailList,
                [action?.payload?.storeId]: action?.payload?.data,
            };
        },
        updateInventory: (state, action) => {
            state.inventory = state.inventory.map((item) =>
                item?.item_id === action?.payload?.item_id
                    ? action?.payload
                    : item
            );
        },
        resetStore: () => initialState,
    },
});

export const {
    setStoreDetails,
    setStoreInventory,
    updateStoreDetails,
    setStoresDetailList,
    updateInventory,
    setStoreList,
    resetStore,
} = storeSlice.actions;
export default storeSlice.reducer;
