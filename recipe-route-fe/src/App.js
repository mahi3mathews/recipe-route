import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailsAsync } from "./api/user/user_account";
import "./App.scss";
import NavBar from "./components/navbar/NavBar";
import { setUserDetailPreferences } from "./redux/reducers/userReducer";
import AppRouter from "./router/AppRouter";
import { useLocation } from "react-router-dom";
import { IdleTimer } from "./components/idleTimer/IdleTimer";
import { loggedOutLinks } from "./constants/user_nav_links";
import { LOGOUT_URL } from "./constants/route_urls";
import Header from "./components/header/Header";
import CartIcon from "./pages/cart/CartIcon";
import { setStoreDetails } from "./redux/reducers/storeReducer";

function App() {
    const dispatch = useDispatch();
    const location = useLocation();

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isAppLoading, setAppLoading] = useState(false);
    const [userId, userRole, totalCart] = useSelector((states) => [
        states?.user?.userDetails?.id ?? "",
        states?.user?.userDetails?.role ?? "",
        states?.user?.cart?.totalCartItems ?? 0,
    ]);

    const setUserDetails = async () => {
        let userRes = await getUserDetailsAsync();
        if (userRes?.data?.id || userRes?.data?.user_details?.id) {
            let userDetails = userRes?.data?.id
                ? userRes?.data
                : userRes?.data?.user_details;
            dispatch(
                setUserDetailPreferences({
                    ...userDetails,
                    img: userRes?.data?.store_details?.brandImg ?? null,
                })
            );
            if (userRes?.data?.store_details) {
                dispatch(setStoreDetails(userRes?.data?.store_details));
            }
            setLoggedIn(true);
            setAppLoading(false);
        } else {
            setAppLoading(false);
        }
    };

    useEffect(() => {
        // Set up check to see if user is still logged in.
        setAppLoading(true);
        if (userId) setLoggedIn(true);
        else setLoggedIn(false);
        // PROBLEM: Able to go to logged out page. CHECK LOGIC
        // console.log(
        //     !userId,
        //     location.pathname,
        //     loggedOutLinks?.includes(location.pathname),
        //     location.pathname !== LOGOUT_URL,
        //     "APP CHECK "
        // );
        if (!userId && !loggedOutLinks?.includes(location.pathname)) {
            setUserDetails();
        } else {
            setAppLoading(false);
        }
    }, [userId]);

    return (
        <div className='app'>
            {isLoggedIn && (
                <NavBar
                    additionalRender={{
                        cart: (
                            <Header type='fS12 fW600 primary'>{` (${totalCart})`}</Header>
                        ),
                        "cart-icon": <CartIcon />,
                    }}
                />
            )}
            <div className='app-body'>
                <AppRouter isAppLoading={isAppLoading} />
            </div>
            {/* <IdleTimer /> */}
        </div>
    );
}

export default App;
