import { useSelector } from "react-redux";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";

const OrderSummary = () => {
    const [cartItems, totalPrice] = useSelector((states) => [
        states?.user?.cart?.cartList ?? {},
        states?.user?.cart?.totalPrice ?? 0,
    ]);
    return (
        <Card className='order-summary'>
            <Header className='order-summary-header' type='fS16 fW600 text'>
                Order Summary
            </Header>
            <div className='order-summary-content-container'>
                {Object.keys(cartItems)?.map((item, key) => {
                    let orderItem = cartItems[item];
                    if (Number(orderItem?.qty) > 0)
                        return (
                            <div
                                key={`${key}-order-item`}
                                className='order-summary-content'>
                                <Header type='fS14 fW500 text'>
                                    {orderItem?.name ?? "Item"}
                                </Header>
                                <Header type='fS14 fW500 text'>
                                    {`${orderItem?.qty ?? ""} x £${
                                        orderItem?.unit_price
                                    }`}
                                </Header>
                            </div>
                        );
                    return null;
                })}
            </div>
            <div className='divider' />
            <div className='order-summary-total'>
                <Header type='fS16 fW600 text'> Total:</Header>
                <Header type='fS16 fW600 text'> £{totalPrice}</Header>
            </div>
        </Card>
    );
};

export default OrderSummary;
