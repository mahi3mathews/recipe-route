import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../../redux/reducers/userReducer";
import { useEffect } from "react";
import { logoutAsync } from "../../api/commonApis";
import { LOGIN_URL, STORE_LOGIN_URL } from "../../constants/route_urls";
import { useNavigate } from "react-router-dom";
import { resetStore } from "../../redux/reducers/storeReducer";
import { resetIngredients } from "../../redux/reducers/ingredientReducer";
import { resetRecipe } from "../../redux/reducers/recipeReducer";
import { resetMealPlanner } from "../../redux/reducers/mealPlannerReducer";
import { resetOrder } from "../../redux/reducers/orderReducer";
import { STORE } from "../../constants/user_roles";
let userRoleCheck;
const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRole = useSelector((states) => states?.user?.userDetails?.role);
    userRoleCheck = userRole;
    useEffect(() => {
        (async () => {
            let res = await logoutAsync();
            if (res?.isLoggedOut) {
                dispatch(resetUser());
                dispatch(resetStore());
                dispatch(resetIngredients());
                dispatch(resetRecipe());
                dispatch(resetMealPlanner());
                dispatch(resetOrder());
                navigate(userRoleCheck === STORE ? STORE_LOGIN_URL : LOGIN_URL);
                userRoleCheck = "";
            }
        })();
    }, []);

    return <></>;
};

export default Logout;
