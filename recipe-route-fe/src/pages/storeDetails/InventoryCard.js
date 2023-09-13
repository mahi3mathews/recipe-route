import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import Card from "../../components/card/Card";
import Toaster from "../../components/toaster";
import itemPlaceholder from "../../svg/item-placeholder.svg";
import InventoryCounter from "./InventoryCounter";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCartAsync } from "../../api/user/user_account";
import {
    setCartItems,
    setCartStoreDetails,
} from "../../redux/reducers/userReducer";

// inventory item id, qty

const InventoryCard = ({ inventoryList, storeId, emptyContent }) => {
    const dispatch = useDispatch();
    const [errorWarning, setErrWarning] = useState("");
    const [itemQtyList, setItemQtyList] = useState({});
    const [inventoryPrevState, setPrevState] = useState([]);
    let isInitialRender = true;

    const [isStoreSelected, cartItems, storeList, totalCartItems] = useSelector(
        (states) => [
            states?.user?.cart?.storeDetails?.id === storeId,
            states?.user?.cart?.cartList,
            states?.stores?.storeList ?? [],
            states?.user?.cart?.totalCartItems ?? 0,
        ]
    );

    const handleStoreSelection = () => {
        if (totalCartItems > 0 && !isStoreSelected) {
            dispatch(
                setCartStoreDetails(
                    storeList?.find((item) => item?.id === storeId)
                )
            );
        }
    };

    const updateCartAsync = async () => {
        let res = await updateUserCartAsync(storeId, itemQtyList);
        if (res?.status?.includes?.("success")) {
            setPrevState([]);
            dispatch(setCartItems(itemQtyList));
        } else {
            setErrWarning(res?.message ?? "");
            // reset the cart for the item
            if (inventoryPrevState?.length > 0) {
                setItemQtyList(
                    inventoryPrevState[inventoryPrevState?.length - 1]
                );
                setPrevState((prevState) =>
                    prevState.slice(0, prevState?.length - 1)
                );
            }
        }
    };

    useEffect(() => {
        if (storeList?.length > 0) {
            handleStoreSelection();
        }
    }, [storeList, totalCartItems]);

    useEffect(() => {
        if (inventoryPrevState?.length > 0) {
            const timer = setTimeout(updateCartAsync, 500);
            return () => clearTimeout(timer);
        }
    }, [inventoryPrevState]);

    useEffect(() => {
        if (
            Object?.keys(cartItems)?.length > 0 &&
            isStoreSelected &&
            isInitialRender
        ) {
            setItemQtyList(cartItems);
            isInitialRender = false;
        }
    }, [cartItems]);

    let isInventoryListEmpty = Object.keys(inventoryList)?.length <= 0;

    return (
        <>
            <Toaster
                show={errorWarning ? true : false}
                className='inventory-item-section-toaster'
                content={errorWarning}
                variant='error'
                handleClose={() => setErrWarning("")}
            />{" "}
            <div className='inventory-item-section-content'>
                {isInventoryListEmpty && emptyContent ? (
                    <Card className='inventory-item-empty-card'>
                        <Header
                            className='inventory-item-empty'
                            type='fS14 fW600 text'>
                            {emptyContent}
                        </Header>
                    </Card>
                ) : (
                    Object.keys(inventoryList).map((inventoryItem, key) => {
                        let sectionItem = inventoryList[inventoryItem];

                        return (
                            <div
                                key={`${key}-inventory-item`}
                                className='inventory-item-section-item'>
                                <Card className='inventory-item-section-card'>
                                    <Icon
                                        icon={
                                            sectionItem?.img ?? itemPlaceholder
                                        }
                                        rounded
                                        className='inventory-item-section-item-icon'
                                    />

                                    <Header type='fS14 fW600 text'>
                                        {sectionItem?.item_name}{" "}
                                        {sectionItem?.qty_measurement ?? ""}{" "}
                                        {sectionItem?.stock_supplier
                                            ? ` - ${sectionItem?.stock_supplier}`
                                            : ""}
                                    </Header>
                                    <Header type='fS12 fW500 text'>
                                        £{sectionItem?.unit_price}{" "}
                                    </Header>
                                    <InventoryCounter
                                        storeId={storeId}
                                        inventoryItemId={inventoryItem}
                                        inventoryItemDetails={sectionItem}
                                        setError={setErrWarning}
                                        itemQtyList={itemQtyList}
                                        setItemQtyList={setItemQtyList}
                                        setPrevState={setPrevState}
                                        inventoryPrevState={inventoryPrevState}
                                    />
                                </Card>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
};

export default InventoryCard;
