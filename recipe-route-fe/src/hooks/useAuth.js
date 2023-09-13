import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, (auth) =>
        auth?.user
            ? `${auth?.user?.role} logged in`
            : `${auth?.user?.role} logged out`
    );
    return useContext(AuthContext);
};

export default useAuth;
