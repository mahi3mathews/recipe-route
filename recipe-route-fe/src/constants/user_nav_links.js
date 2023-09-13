import {
    LANDING_HOME_URL,
    LOGIN_URL,
    LOGOUT_URL,
    STORE_REGISTER_URL,
    STORE_HOME_URL,
    USER_HOME_URL,
    USER_REGISTER_URL,
    STORE_LOGIN_URL,
    ONBOARDING_URL,
    RECIPES_URL,
    USER_PROFILE_URL,
    CART_URL,
    STORE_ONBOARDING_URL,
    STORE_LIST_URL,
    USER_CHECKOUT_URL,
    STORE_ORDERS_URL,
    USER_ORDERS_URL,
} from "./route_urls";
import { USER, STORE } from "./user_roles";
import userIcon from "../svg/user-icon.svg";

export const navLinks = [
    {
        link: USER_HOME_URL,
        isNotDisplay: true,
        title: "Home",
        roles: [USER],
    },
    {
        link: STORE_HOME_URL,
        isNotDisplay: true,
        title: "Home",
        roles: [STORE],
    },
    {
        link: ONBOARDING_URL,
        isNotDisplay: true,
        isNavHidden: true,
        title: "Onboarding",
        roles: [USER],
    },
    {
        link: STORE_ONBOARDING_URL,
        isNotDisplay: true,
        isNavHidden: true,
        title: "Store Onboarding",
        roles: [STORE],
    },
    {
        link: RECIPES_URL,
        title: "Recipes",
        roles: [USER],
        isAlwaysRender: true,
    },
    {
        link: STORE_LIST_URL,
        title: "Stores",
        roles: [USER],
        isAlwaysRender: true,
    },
    {
        link: USER_ORDERS_URL,
        title: "Orders",
        position: "right",
        roles: [USER],
        isAlwaysRender: true,
    },
    {
        link: CART_URL,
        position: "right",
        roles: [USER],
        isResponsiveLink: false,
        customComponent: "cart-icon",
    },
    {
        link: CART_URL,
        title: "Cart",
        position: "right",
        roles: [USER],
        isResponsiveLink: true,
        additionalCustom: "cart",
    },

    {
        link: USER_CHECKOUT_URL,
        title: "Checkout",
        roles: [USER],
        isNavHidden: true,
        isNotDisplay: true,
    },

    {
        link: STORE_ORDERS_URL,
        title: "Orders",
        position: "right",
        roles: [STORE],
        isAlwaysRender: true,
    },
    {
        link: USER_PROFILE_URL,
        title: "Profile",
        roles: [USER, STORE],
        isResponsiveLink: true,
    },
    {
        link: LOGOUT_URL,
        title: "Logout",
        roles: [USER, STORE],
        isResponsiveLink: true,
    },
    {
        icon: userIcon,
        position: "right",
        dropdown: [{ data: { url: LOGOUT_URL }, title: "Logout" }],
        roles: [STORE],
    },
    {
        icon: userIcon,
        position: "right",
        dropdown: [
            { data: { url: USER_PROFILE_URL }, title: "Profile" },
            { data: { url: LOGOUT_URL }, title: "Logout" },
        ],
        roles: [USER],
    },
];

export const loggedOutLinks = [
    LOGIN_URL,
    USER_REGISTER_URL,
    LOGOUT_URL,
    STORE_REGISTER_URL,
    // LANDING_HOME_URL,
    STORE_LOGIN_URL,
    "/",
];
