import Header from "../../components/header/Header";
import Badge from "../../components/badge";
import { order_types } from "../../constants/order_status";
import { payment_status } from "../../constants/payment_status";
import StoreOrderContent from "./StoreOrderContent";
import Card from "../../components/card/Card";
import Button from "../../components/button/Button";
import { phoneFormatter } from "../../utils/phoneFormatter";
import StoreStatusDropdown from "./StoreStatusDropdown";

const StoreOrderTable = ({ orders, handleOrderClick }) => {
    const columns = [
        "Customer",
        "Products",
        "Payment Status",
        "Type",
        "Status",
        "",
    ];

    const cellRender = (type, orderItem) => {
        switch (type) {
            case "Products":
                return <StoreOrderContent order={orderItem?.order_items} />;
            case "Payment Status":
                return (
                    <Badge
                        className='store-order-payment-badge'
                        fontType='fS14 fW600 lightShade'
                        variant={payment_status[orderItem?.payment_status]}>
                        {orderItem?.payment_status}
                    </Badge>
                );
            case "Type":
                return (
                    <Header type='fS14 fW500 text'>
                        {order_types[orderItem?.order_type]}
                    </Header>
                );
            case "Status":
                return <StoreStatusDropdown orderItem={orderItem} />;
            case "Customer":
                const customer = orderItem?.user_details;
                return (
                    <Header
                        type='fS14 fW500 text'
                        className='store-order-customer-details'>
                        {customer?.name}

                        <div>
                            <a
                                className='store-order-customer-contact'
                                href={
                                    customer?.phone_number
                                        ? `tel:${customer?.phone_number}`
                                        : `mailto:${customer?.email}`
                                }>
                                {phoneFormatter(customer?.phone_number) ??
                                    customer?.email}
                            </a>
                        </div>
                    </Header>
                );
            case "":
                return (
                    <Button
                        onClick={() => handleOrderClick(orderItem)}
                        className='store-order-view-more'
                        variant='primary'
                        fontType='fS12 fW600 lightShade'>
                        View order
                    </Button>
                );
        }
    };
    return (
        <div className='store-order-table'>
            <div className='store-order-table-header'>
                <Card className='store-order-table-row header'>
                    {columns.map((item, key) => (
                        <div
                            className='store-order-header-cell'
                            key={`${key}-key-item-column`}>
                            <Header type='fS16 fW600 text'>{item}</Header>
                        </div>
                    ))}
                </Card>
            </div>
            <div className='store-order-table-body'>
                {orders?.length > 0 ? (
                    orders?.map((order, key) => {
                        return (
                            <Card
                                className='store-order-table-row'
                                index={`${key}-order-table-row`}>
                                {columns.map((column, cKey) => {
                                    return (
                                        <div
                                            className='store-order-cell'
                                            key={`${key}-${cKey}-order-table-cell`}>
                                            {cellRender(column, order)}
                                        </div>
                                    );
                                })}
                            </Card>
                        );
                    })
                ) : (
                    <Card className='store-order-table-row empty'>
                        <Header type='fS21 fW600 text'>
                            No orders are placed yet.
                        </Header>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default StoreOrderTable;
