import { useEffect } from "react";
import {
    LOGIN_URL,
    LOGOUT_URL,
    USER_REGISTER_URL,
    STORE_REGISTER_URL,
} from "../../constants/route_urls";
import { useNavigate, useLocation } from "react-router-dom";

const whitelist = [LOGIN_URL, USER_REGISTER_URL, STORE_REGISTER_URL];

export const IdleTimer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    let timeout = null;

    const goBackToHome = () => {
        navigate(LOGOUT_URL);
    };

    const restartAutoReset = () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            goBackToHome();
        }, 1000 * 60);
    };

    const onMouseMove = () => {
        restartAutoReset();
    };

    useEffect(() => {
        let preventReset = false;
        for (const path of whitelist) {
            if (path === location.pathname) {
                preventReset = true;
            }
        }
        if (preventReset) {
            return;
        }

        restartAutoReset();

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
                window.removeEventListener("mousemove", onMouseMove);
            }
        };
    }, [location.pathname]);
    return <div />;
};
