import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import storeReducer from "./reducers/storeReducer";
import ingredientReducer from "./reducers/ingredientReducer";
import recipeReducer from "./reducers/recipeReducer";
import mealPlannerReducer from "./reducers/mealPlannerReducer";
import orderReducer from "./reducers/orderReducer";

// Combine all reducers(state) of the application into one reducer
const rootReducer = combineReducers({
    user: userReducer,
    stores: storeReducer,
    ingredients: ingredientReducer,
    recipes: recipeReducer,
    mealPlans: mealPlannerReducer,
    order: orderReducer,
});

export default rootReducer;
