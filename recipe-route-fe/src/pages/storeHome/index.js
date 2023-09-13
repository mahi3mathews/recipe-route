import { useDispatch, useSelector } from "react-redux";
import "./store_home.scss";
import Header from "../../components/header/Header";
import { useEffect } from "react";
import { setStoreInventory } from "../../redux/reducers/storeReducer";
import { fetchStoreInventoryAsync } from "../../api/store/stores";
import { getIngredientsAsync } from "../../api/ingredients";
import { setIngredients } from "../../redux/reducers/ingredientReducer";
import SalesOverview from "./SalesOverview";

const StoreHome = () => {
    const dispatch = useDispatch();
    const [userDetails, store_details] = useSelector((states) => [
        states?.user?.userDetails,
        states?.stores?.storeDetails,
    ]);

    const setupStoreAsync = async () => {
        let res = await fetchStoreInventoryAsync();
        if (res?.status?.includes?.("success")) {
            dispatch(setStoreInventory(res?.data));
        }
        let res1 = await getIngredientsAsync();
        if (res1.status?.includes?.("success")) {
            dispatch(setIngredients(res1?.data));
        }
    };

    useEffect(() => {
        setupStoreAsync();
    }, []);

    return (
        <div className='store-home'>
            <Header type='fS20 fW600 text'>
                Welcome {userDetails?.name ?? ""},{" "}
            </Header>
            <SalesOverview />
        </div>
    );
};

export default StoreHome;
