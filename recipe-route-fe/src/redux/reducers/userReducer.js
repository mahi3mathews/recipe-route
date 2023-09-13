import { createSlice } from "@reduxjs/toolkit";
import { STORE } from "../../constants/user_roles";
import {
    getCartTotalItems,
    getCartTotalPrice,
} from "../../utils/cartFormatter";

const initialState = {
    userDetails: { address: {} },
    preferences: { favorites: [], default_store: "" },
    cart: {
        cartList: {},
        shoppingList: {},
        storeDetails: {},
        totalShoppingList: 0,
        totalCartItems: 0,
    },
    orderSummary: {},
};

const userSlice = createSlice({
    initialState,
    name: "user",
    reducers: {
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
        updateUserDetails: (state, action) => {
            state.userDetails = { ...state.userDetails, ...action.payload };
        },
        setUserDetailPreferences: (state, action) => {
            let userDetails = { ...action.payload };
            state.preferences = userDetails.preferences;
            if (userDetails?.role !== STORE)
                state.cart =
                    {
                        ...state.cart,
                        ...userDetails?.cart,
                        totalCartItems: getCartTotalItems(
                            userDetails?.cart?.cartList
                        ),
                        totalShoppingList: Object.keys(
                            userDetails?.cart?.shoppingList
                        )?.length,
                        totalPrice: getCartTotalPrice(
                            userDetails?.cart?.cartList
                        ),
                    } ?? {};
            delete userDetails.cart;
            delete userDetails.preferences;
            state.userDetails = userDetails;
        },
        updateUserPreferences: (state, action) => {
            state.preferences = {
                ...state.preferences,
                ...action?.payload,
            };
        },
        updateUserFavPreferences: (state, action) => {
            if (state.preferences.favorites?.includes(action?.payload))
                state.preferences.favorites =
                    state.preferences.favorites.filter(
                        (item) => item !== action.payload
                    );
            else
                state.preferences.favorites = [
                    ...state.preferences.favorites,
                    action.payload,
                ];
        },
        updateShoppingList: (state, action) => {
            state.cart.shoppingList = action.payload;
            state.cart.totalShoppingList = Object.keys(action.payload)?.length;
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        setCartItems: (state, action) => {
            state.cart.cartList = {
                ...action.payload,
            };
            state.cart.totalCartItems = getCartTotalItems(state.cart.cartList);
            state.cart.totalPrice = getCartTotalPrice(state.cart.cartList);
        },
        setCartStoreDetails: (state, action) => {
            state.cart.storeDetails = { ...action.payload };
        },
        addUserAddress: (state, action) => {
            state.userDetails = { ...action.payload };
        },
        resetCartAndStore: (state) => {
            state.cart.cartList = {};
            state.cart.totalCartItems = 0;
            state.cart.store_id = "";
            state.cart.storeDetails = {};
        },
        resetUser: () => initialState,
    },
});

export const {
    setUserDetails,
    updateUserDetails,
    setUserDetailPreferences,
    setCart,
    setCartItems,
    resetUser,
    setCartStoreDetails,
    updateUserPreferences,
    resetCartAndStore,
    updateShoppingList,
    addUserAddress,
    updateUserFavPreferences,
} = userSlice.actions;
export default userSlice.reducer;
