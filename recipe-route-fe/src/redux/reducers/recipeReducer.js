import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    cacheList: {},
    pagination: {
        totalRecords: 0,
    },
};

const recipeSlice = createSlice({
    initialState,
    name: "recipes",
    reducers: {
        setRecipes: (state, action) => {
            state.list = action?.payload?.data;
            state.pagination.totalRecords = action?.payload?.total_records;
        },
        updateRecipeCache: (state, action) => {
            state.cacheList = {
                ...state.cacheList,
                [action?.payload?.id]: action?.payload,
            };
        },
        resetRecipe: () => initialState,
    },
});

export const { setRecipes, updateRecipeCache, resetRecipe } =
    recipeSlice.actions;
export default recipeSlice.reducer;
