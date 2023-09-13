import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: {},
};

const ingredientsSlice = createSlice({
    initialState,
    name: "ingredients",
    reducers: {
        setIngredients: (state, action) => {
            state.list = { ...action.payload };
        },
        resetIngredients: () => initialState,
    },
});

export const { resetIngredients, setIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
