import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/Header";
import InventoryCounter from "../storeDetails/InventoryCounter";
import { useState, useEffect } from "react";
import Toaster from "../../components/toaster";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { STORE_LIST_URL, USER_CHECKOUT_URL } from "../../constants/route_urls";
import { updateUserCartAsync } from "../../api/user/user_account";
import { setCartItems } from "../../redux/reducers/userReducer";

const CartTable = ({ list = {}, totalPrice }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const columns = ["Item", "Price", "Qty", "Total"];

    const [warningMessage, setWarningMessage] = useState("");

    let isInitialRender = true;
    const [itemQtyList, setItemQtyList] = useState({});
    const [inventoryPrevState, setPrevState] = useState([]);

    const [cartItems, totalCartItems, storeId] = useSelector((states) => [
        states?.user?.cart?.cartList ?? {},
        states?.user?.cart?.totalCartItems,
        states?.user?.cart?.store_id ??
            states?.user?.cart?.storeDetails?.id ??
            "",
    ]);

    const updateCartAsync = async () => {
        let res = await updateUserCartAsync(storeId, itemQtyList);
        if (res?.status?.includes?.("success")) {
            setPrevState([]);
            dispatch(setCartItems(itemQtyList));
        } else {
            setWarningMessage(res?.message ?? "");
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
        if (inventoryPrevState?.length > 0) {
            const timer = setTimeout(updateCartAsync, 500);
            return () => clearTimeout(timer);
        }
    }, [inventoryPrevState]);

    useEffect(() => {
        if (Object?.keys(cartItems)?.length > 0 && isInitialRender) {
            setItemQtyList(cartItems);
            isInitialRender = false;
        }
    }, [cartItems]);

    let isListEmpty = totalCartItems <= 0;

    const getItemCell = (type, inventoryId, inventoryData) => {
        switch (type) {
            case "Item":
                return (
                    <Header type='fS14 fW600 text'>
                        {inventoryData?.name}
                    </Header>
                );
            case "Price":
                return (
                    <Header type='fS14 fW600 text'>
                        £{inventoryData?.unit_price}
                    </Header>
                );
            case "Qty":
                return (
                    <InventoryCounter
                        inventoryItemDetails={inventoryData}
                        inventoryItemId={inventoryId}
                        storeId={storeId}
                        setError={setWarningMessage}
                        itemQtyList={itemQtyList}
                        setItemQtyList={setItemQtyList}
                        setPrevState={setPrevState}
                        inventoryPrevState={inventoryPrevState}
                    />
                );
            case "Total":
                return (
                    <Header type='fS14 fW600 text'>
                        £{inventoryData?.total_price}
                    </Header>
                );
            default:
                return null;
        }
    };

    const handleCheckout = () => {
        navigate(USER_CHECKOUT_URL);
    };
    const handleStoreClick = () => {
        navigate(STORE_LIST_URL);
    };

    return (
        <div className='cart-table'>
            <Toaster
                show={warningMessage ? true : false}
                className='cart-table-toaster'
                content={warningMessage}
                variant='error'
                handleClose={() => setWarningMessage("")}
            />
            <Header type='fS20 fW600 text' className='cart-view-header'>
                Your Cart {`[${totalCartItems} items]`}
            </Header>
            <div className='cart-table-header'>
                {columns?.map((item, key) => (
                    <div
                        className='cart-table-header-cell'
                        key={`${key}-cart-header`}>
                        <Header type='fS18 fW600 text'>{item}</Header>
                    </div>
                ))}
            </div>
            <div className='cart-table-row-container'>
                {!isListEmpty ? (
                    Object.keys(list)?.map((inventoryID, key) => {
                        let inventoryData = list[inventoryID];
                        if (Number(inventoryData?.qty) > 0)
                            return (
                                <div className='cart-table-row'>
                                    {columns.map((type, index) => (
                                        <div
                                            className='cart-table-row-cell'
                                            key={`${key}-${index}-cart-item-cell`}>
                                            {getItemCell(
                                                type,
                                                inventoryID,
                                                inventoryData
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        return null;
                    })
                ) : (
                    <div className='cart-table-empty-row'>
                        <Header type='fS16 fW600 text'>
                            There are no items in cart. Head over to stores
                        </Header>
                        <Button
                            type='button'
                            variant='primary'
                            fontType='fS14 fW600 lightShade'
                            onClick={handleStoreClick}>
                            Go to stores
                        </Button>
                    </div>
                )}
            </div>

            {!isListEmpty && (
                <>
                    <div className='cart-table-total-footer'>
                        <Header type='fS16 fW600 text'>Total Price:</Header>
                        <Header
                            className='cart-table-total-footer-amt'
                            type='fS18 fW600 text'>
                            £{totalPrice}
                        </Header>
                    </div>
                    <div className='cart-table-checkout'>
                        <Button
                            className='cart-table-checkout-btn'
                            type='button'
                            variant='primary'
                            fontType='fS18 fW600 lightAccent'
                            onClick={handleCheckout}>
                            Checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartTable;
