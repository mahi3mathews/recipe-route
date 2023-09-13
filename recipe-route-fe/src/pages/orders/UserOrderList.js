import Card from "../../components/card/Card";
import Icon from "../../components/icon/Icon";
import userPlaceholder from "../../svg/userIcon-darkAccent.svg";
import Header from "../../components/header/Header";
import Badge from "../../components/badge";
import { getCartTotalItems } from "../../utils/cartFormatter";
import { user_order_status } from "../../constants/order_status";
import { payment_status } from "../../constants/payment_status";

const UserOrderList = ({ orders, handleOrderClick }) => {
    return orders?.map((order, key) => {
        return (
            <Card
                onClick={() => handleOrderClick(order)}
                className='orders-item'
                index={key}>
                <div className='orders-store-img-container'>
                    <Icon
                        rounded
                        icon={order?.store_details?.brandImg ?? userPlaceholder}
                        className='orders-store-img'
                    />
                </div>
                <div className='orders-details'>
                    <Header
                        className='orders-details-row'
                        type='fS16 fW600 text'>
                        {order?.store_details?.storeName}
                    </Header>
                    <Header
                        className='orders-details-row'
                        type='fS14 fW400 text'>
                        Total items: {getCartTotalItems(order?.order_items)}
                    </Header>

                    <Header
                        className='orders-details-row'
                        type='fS16 fW400 text'>
                        {user_order_status[order?.status](order?.order_type)}
                    </Header>
                </div>
                <div className='orders-totalprice'>
                    <Header type='fS21 fW600 text'>
                        £{order?.total_price}
                    </Header>

                    <Badge
                        variant={payment_status[order?.payment_status]}
                        className='orders-payment-status'>
                        {String(order?.payment_status).toLowerCase()}
                    </Badge>
                </div>
            </Card>
        );
    });
};

export default UserOrderList;
