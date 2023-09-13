import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrdersAsync } from "../../api/user/user_account";
import { setOrderList } from "../../redux/reducers/orderReducer";
import Toaster from "../../components/toaster";
import "./orders.scss";
import Header from "../../components/header/Header";
import OrderDetailsModal from "./OrderDetailsModal";
import { getStoreOrdersAsync } from "../../api/store/stores";
import UserOrderList from "./UserOrderList";
import StoreOrderTable from "./StoreOrderTable";

const Orders = ({ isStore }) => {
    const dispatch = useDispatch();
    const [orders] = useSelector((states) => [states?.order?.orderList]);
    const [toastErr, setToasterErr] = useState("");
    const [orderDetails, setOrderDetails] = useState({});
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const setupOrders = async () => {
        let res = await (isStore
            ? getStoreOrdersAsync()
            : getUserOrdersAsync());
        if (res?.status?.includes?.("success")) {
            dispatch(setOrderList(res?.data));
        } else {
            setToasterErr(
                `Failed to fetch ${isStore ? "store" : "user"}'s orders`
            );
        }
    };

    const handleShowOrderDetails = () => setShowOrderDetails(true);
    const handleHideOrderDetails = () => {
        setShowOrderDetails(false);
        setOrderDetails({});
    };

    const handleOrderClick = (orderDetails) => {
        setOrderDetails(orderDetails);
        handleShowOrderDetails(true);
    };

    useEffect(() => {
        setupOrders();
    }, []);
    return (
        <div className='orders'>
            <Header className='orders-header' type='fS20 fW600 text'>
                {isStore ? "Store" : "Your"} Orders
            </Header>
            <Toaster
                variant='error'
                content={toastErr}
                handleClose={() => setToasterErr("")}
                show={toastErr ? true : false}
            />

            <OrderDetailsModal
                isStore={isStore}
                showModal={showOrderDetails}
                handleClose={handleHideOrderDetails}
                orderDetails={orderDetails}
            />
            {isStore ? (
                <StoreOrderTable
                    orders={orders}
                    handleOrderClick={handleOrderClick}
                />
            ) : (
                <UserOrderList
                    orders={orders}
                    handleOrderClick={handleOrderClick}
                />
            )}
        </div>
    );
};

export default Orders;
