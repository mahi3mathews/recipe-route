import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreDetailsAsync } from "../../api/store/stores";
import { useEffect, useState } from "react";
import { setStoresDetailList } from "../../redux/reducers/storeReducer";
import Card from "../../components/card/Card";
import Icon from "../../components/icon/Icon";
import Header from "../../components/header/Header";
import "./storeDetails.scss";
import StoreInventory from "./StoreInventory";
import { Spinner } from "react-bootstrap";
import Button from "../../components/button/Button";
import { STORE_LIST_URL } from "../../constants/route_urls";
import { updateUserPreferencesAsync } from "../../api/user/user_account";
import { updateUserPreferences } from "../../redux/reducers/userReducer";
import CompareCartModal from "./CompareCartModal";

const StoreDetails = () => {
    const { storeId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [storeDetailList, isDefaultStore] = useSelector((states) => [
        states?.stores?.storeDetailList,
        states?.user?.preferences?.default_store === storeId,
    ]);
    const [storeDetails, setStoreDetails] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [showCompareCart, setShowCompareCart] = useState(false);

    const handleAddaDefaultStore = async () => {
        // dispatch call to preferences default_store and id
        let res = await updateUserPreferencesAsync({ default_store: storeId });
        if (res?.status?.includes?.("success")) {
            dispatch(updateUserPreferences({ default_store: storeId }));
        } else {
            // show toaster that it failed
        }
    };

    const handleCompareModal = () => {
        setShowCompareCart(true);
    };

    const handleCloseModal = () => {
        setShowCompareCart(false);
    };

    const getStoreDetailsAsync = async () => {
        let res = await fetchStoreDetailsAsync(storeId);
        if (res?.status?.includes("success")) {
            dispatch(setStoresDetailList({ storeId, data: res?.data }));
        } else {
            setLoading(false);
            navigate(STORE_LIST_URL);
        }
    };
    useEffect(() => {
        if (!storeDetailList?.[storeId]) getStoreDetailsAsync();
    }, [storeId]);

    useEffect(() => {
        if (storeDetailList?.[storeId]) {
            setStoreDetails(storeDetailList[storeId]);
            setLoading(false);
        }
    }, [storeDetailList?.[storeId]]);

    return (
        <div className='store-details'>
            <CompareCartModal
                storeId={storeId}
                showModal={showCompareCart}
                handleClose={handleCloseModal}
                inventory={storeDetails["inventory"] ?? {}}
            />
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <Card className='store-details-header'>
                        <Icon
                            icon={storeDetails["brandImg"]}
                            className='store-details-icon'
                            rounded
                        />
                        <div className='store-details-title'>
                            <Header
                                type='fS21 fW600 text'
                                className='store-details-storename'>
                                {storeDetails["storeName"]}
                                {isDefaultStore && (
                                    <Header type='fS12 fW600 primary'>
                                        {"(Default Store)"}
                                    </Header>
                                )}
                            </Header>
                            <div className='store-details-address'>
                                <Header type='fS14 fW600 text'>
                                    {storeDetails["address"]?.street},{" "}
                                    {storeDetails["address"]?.city}
                                </Header>
                                <Header type='fS14 fW600 text'>
                                    {storeDetails["address"]?.post_code},{" "}
                                    {storeDetails["address"]?.country}
                                </Header>
                            </div>
                        </div>
                        <div className='store-details-default-store'>
                            {!isDefaultStore && (
                                <Button
                                    onClick={handleAddaDefaultStore}
                                    variant='darkAccent'
                                    fontType='fS14 fW600 primary'>
                                    Add as default store
                                </Button>
                            )}
                            <Button
                                onClick={handleCompareModal}
                                variant='lightShade'
                                fontType='fS14 fW600 text'>
                                Compare cart
                            </Button>
                        </div>
                    </Card>
                    <div className='store-details-inventory-container'>
                        <StoreInventory
                            storeId={storeId}
                            inventory={storeDetails["inventory"]}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default StoreDetails;
