import { createSlice } from "@reduxjs/toolkit";
import { dateFormatter } from "../../utils/dateFormatter";

const initialState = {
    plans: {},
};

const mealPlannerSlice = createSlice({
    initialState,
    name: "mealPlanner",
    reducers: {
        updateMealPlans: (state, action) => {
            state.plans = {
                ...state?.plans,
                [action?.payload?.mealPlanWeek ?? "unmarked_meals"]:
                    action?.payload?.mealPlans,
            };
        },
        updateMealPlanRecipe: (state, action) => {
            let weekFilter = `${action.payload?.weekFilter?.from}_${action.payload?.weekFilter?.to}`;
            let recipeData = action?.payload?.recipe;
            let mealType = action?.payload?.mealType;
            const updatedWeek = state.plans[weekFilter].map((plan) => {
                if (
                    dateFormatter(plan?.meal_date) ===
                    dateFormatter(action?.payload?.mealDate)
                ) {
                    plan.meals[mealType] = {
                        ...plan.meals[mealType],
                        ...recipeData,
                    };
                }
                return plan;
            });
            state.plans[weekFilter] = updatedWeek;
        },
        resetMealPlanner: () => initialState,
    },
});

export const { updateMealPlans, updateMealPlanRecipe, resetMealPlanner } =
    mealPlannerSlice.actions;
export default mealPlannerSlice.reducer;
