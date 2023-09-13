import {
    LOGIN_URL,
    LOGOUT_URL,
    USER_HOME_URL,
    STORE_HOME_URL,
    USER_REGISTER_URL,
    STORE_REGISTER_URL,
    STORE_LOGIN_URL,
    ONBOARDING_URL,
    USER_PROFILE_URL,
    RECIPES_URL,
    CART_URL,
    STORE_ONBOARDING_URL,
    STORE_LIST_URL,
    STORE_DETAILS_URL,
    USER_CHECKOUT_URL,
    STORE_ORDERS_URL,
    USER_ORDERS_URL,
} from "../constants/route_urls";
import { Route, Routes as ReactRoutes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { loggedOutLinks, navLinks } from "../constants/user_nav_links";
import { USER, STORE } from "../constants/user_roles";
import Login from "../pages/login";
import Logout from "../pages/logout";
import { Spinner } from "react-bootstrap";
import Register from "../pages/register";
import Onboarding from "../pages/onboardingUser";
import UserHome from "../pages/userHome";
import Recipes from "../pages/recipes";
import Cart from "../pages/cart";
import StoreOnboarding from "../pages/storeOnboarding";
import StoresList from "../pages/storesList";
import StoreDetails from "../pages/storeDetails";
import Checkout from "../pages/checkout";
import StoreInventoryDetails from "../pages/storeInventoryDetails";
import Orders from "../pages/orders";
import UserProfile from "../pages/userProfile";
let prevLink = "";
const AppRouter = ({ isAppLoading }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setLoading] = useState(true);
    const [userRole, userId, userOnboarding] = useSelector((states) => [
        states?.user?.userDetails?.role,
        states?.user?.userDetails?.id,
        states?.user?.preferences?.is_onboarding_complete,
    ]);

    const componentLoader = (component) => (isLoading ? null : component);

    useEffect(() => {
        const isLoggedIn = userId ?? false;
        const userUrls = navLinks
            .filter((link) => link.roles.includes(USER) && !link.icon)
            .map((link) => link.link);
        const storeUrls = navLinks
            .filter((link) => link.roles.includes(STORE) && !link.icon)
            .map((link) => link.link);

        console.log("location pathname", location.pathname);
        console.log("is logged in", isLoggedIn);
        console.log("is store url", storeUrls.includes(location.pathname));
        console.log("is user url", userUrls.includes(location.pathname));
        console.log(
            "prv link",
            location.pathname,
            loggedOutLinks.includes(location.pathname)
        );
        prevLink = !loggedOutLinks.includes(location.pathname)
            ? location.pathname
            : !prevLink
            ? userRole === USER
                ? USER_HOME_URL
                : userRole === STORE
                ? STORE_HOME_URL
                : prevLink
            : prevLink;

        if (!isLoggedIn && !loggedOutLinks.includes(location.pathname)) {
            navigate(LOGIN_URL);
        } else if (
            isLoggedIn &&
            userRole === USER &&
            ((storeUrls?.includes(location?.pathname) &&
                !userUrls?.includes(location?.pathname)) ||
                loggedOutLinks.includes(location.pathname))
        ) {
            // Case-scenario where user tries to access links not provided to them
            if (location.pathname === LOGIN_URL && !userOnboarding)
                navigate(ONBOARDING_URL);
            else navigate(prevLink);
        } else if (
            isLoggedIn &&
            userRole === STORE &&
            ((!storeUrls?.includes(location?.pathname) &&
                userUrls?.includes(location?.pathname)) ||
                loggedOutLinks.includes(location.pathname))
        ) {
            // Case-scenario where owner tries to access links not provided to them
            if (location.pathname === STORE_LOGIN_URL && !userOnboarding)
                navigate(STORE_ONBOARDING_URL);
            else navigate(prevLink);
        }
        setLoading(false);
    }, [location.pathname, userRole, userId]);

    return isAppLoading ? (
        <Spinner />
    ) : (
        <ReactRoutes>
            <Route
                path={USER_REGISTER_URL}
                element={componentLoader(<Register />)}
            />
            <Route
                path={STORE_REGISTER_URL}
                element={componentLoader(<Register isStore />)}
            />
            <Route path={LOGIN_URL} element={componentLoader(<Login />)} />
            <Route
                path={STORE_LOGIN_URL}
                element={componentLoader(<Login isStore />)}
            />
            <Route path={LOGOUT_URL} element={componentLoader(<Logout />)} />
            <Route
                path={ONBOARDING_URL}
                element={componentLoader(<Onboarding />)}
            />
            <Route
                path={USER_HOME_URL}
                element={componentLoader(<UserHome />)}
            />
            <Route
                path={STORE_HOME_URL}
                element={componentLoader(<StoreInventoryDetails />)}
            />
            <Route
                path={USER_PROFILE_URL}
                element={componentLoader(<UserProfile />)}
            />
            <Route
                path={STORE_ONBOARDING_URL}
                element={componentLoader(<StoreOnboarding />)}
            />
            <Route path={RECIPES_URL} element={componentLoader(<Recipes />)} />
            <Route path={CART_URL} element={componentLoader(<Cart />)} />
            <Route
                path={STORE_LIST_URL}
                element={componentLoader(<StoresList />)}
            />
            <Route
                path={`${STORE_DETAILS_URL}/:storeId`}
                element={componentLoader(<StoreDetails />)}
            />
            <Route
                path={USER_CHECKOUT_URL}
                element={componentLoader(<Checkout />)}
            />

            <Route
                path={STORE_ORDERS_URL}
                element={componentLoader(<Orders isStore />)}
            />
            <Route
                path={USER_ORDERS_URL}
                element={componentLoader(<Orders />)}
            />
        </ReactRoutes>
    );
};

export default AppRouter;
