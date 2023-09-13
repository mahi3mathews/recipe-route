import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import Modal from "../../components/modal/Modal";
import userPlaceholder from "../../svg/userIcon-darkAccent.svg";
import { order_types, user_order_status } from "../../constants/order_status";
import Badge from "../../components/badge";
import { getCartTotalItems } from "../../utils/cartFormatter";
import { phoneFormatter } from "../../utils/phoneFormatter";

const OrderDetailsModal = ({
    showModal,
    handleClose,
    orderDetails,
    isStore,
}) => {
    const userDetails = orderDetails?.user_details;
    return Object.keys(orderDetails)?.length > 0 ? (
        <Modal
            title={`${order_types[orderDetails?.order_type]} Order`}
            footerBtn='Close'
            submitBtn={{
                variant: "primary",
                fontType: "fS14 fW600 lightShade",
            }}
            className='orders-details-modal'
            onSubmit={handleClose}
            onHide={handleClose}
            show={showModal}>
            {isStore ? (
                <div className='orders-details-modal-store-customer'>
                    <Header
                        type='fS21 fW600 text'
                        className='orders-details-modal-customer-header'>
                        Customer details
                    </Header>
                    <div className='orders-details-modal-customer-info'>
                        <Header
                            type='fS14 fW700 text'
                            className='orders-details-modal-customer-label'>
                            Name:{" "}
                        </Header>
                        <Header type='fS16 fW400 text'>
                            {userDetails?.name}
                        </Header>
                    </div>
                    {userDetails?.phone_number && (
                        <div className='orders-details-modal-customer-info'>
                            <Header
                                type='fS14 fW700 text'
                                className='orders-details-modal-customer-label'>
                                Phone number:
                            </Header>
                            <Header
                                className='orders-details-modal-link'
                                type='fS16 fW400 primary'>
                                <a href={`tel:${userDetails?.phone_number}`}>
                                    {phoneFormatter(userDetails?.phone_number)}
                                </a>
                            </Header>
                        </div>
                    )}
                    <div className='orders-details-modal-customer-info'>
                        <Header
                            type='fS14 fW700 text '
                            className='orders-details-modal-customer-label'>
                            Email:
                        </Header>
                        <Header
                            className='orders-details-modal-link'
                            type='fS16 fW400 primary'>
                            <a href={`mailto:${userDetails?.email}`}>
                                {userDetails?.email}
                            </a>
                        </Header>
                    </div>
                </div>
            ) : (
                <div className='orders-details-modal-header'>
                    <div className='orders-store-img-container'>
                        <Icon
                            rounded
                            icon={
                                orderDetails?.store_details?.brandImg ??
                                userPlaceholder
                            }
                            className='orders-store-img'
                        />
                    </div>
                    <div className='orders-details'>
                        <Header
                            className='orders-details-row'
                            type='fS16 fW700 text'>
                            {orderDetails?.store_details?.storeName}
                        </Header>

                        <Badge
                            variant='darkAccent'
                            className='orders-details-status'
                            fontType='fS16 fW600 lightShade'>
                            {user_order_status[orderDetails?.status]?.(
                                orderDetails?.order_type
                            )}
                        </Badge>
                    </div>
                </div>
            )}
            <div className='orders-details-invoice'>
                <Header type='fS21 fW600 text'>Order Items</Header>
                <div>
                    {Object.keys(orderDetails?.order_items)?.map(
                        (itemId, key) => {
                            let orderItem =
                                orderDetails?.order_items?.[itemId] ?? {};
                            return (
                                <>
                                    <div className='orders-details-invoice-item'>
                                        <Header type='fS16 fW500 text'>
                                            {orderItem?.name} x {orderItem?.qty}
                                        </Header>
                                        <Header type='fS16 fW500 text'>
                                            £{orderItem?.total_price}
                                        </Header>
                                    </div>
                                </>
                            );
                        }
                    )}
                </div>
                <div className='orders-details-invoice-total'>
                    <Header type='fS18 fW600 text'>
                        {isStore
                            ? "Total Price"
                            : `Total for ${getCartTotalItems(
                                  orderDetails?.order_items
                              )} item(s)`}
                        :
                    </Header>
                    <Header type='fS18 fW600 text'>
                        £{orderDetails?.total_price}
                    </Header>
                </div>
            </div>
        </Modal>
    ) : null;
};

export default OrderDetailsModal;
