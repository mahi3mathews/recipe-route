import { useSelector } from "react-redux";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import Tooltip from "../../components/tooltip";
import infoIcon from "../../svg/info-primary.svg";
import React from "react";

const DeliveryPickup = () => {
    const [storeDetails] = useSelector((states) => [
        states?.user?.cart?.storeDetails ?? {},
    ]);
    return (
        <Card className='delivery-pickup'>
            <div className='delivery-pickup-header'>
                <Header type='fS18 fW600 text'> Pickup</Header>

                <Tooltip
                    id='pickuptt'
                    direction='right'
                    content={
                        <Header
                            type='fS14 fW500 primary'
                            className='delivery-pickup-tooltip-content'>
                            Currently the application only supports pickup
                            orders. Upcoming updates will include delivery as
                            well. Thank you for your support!
                        </Header>
                    }>
                    <Icon
                        src={infoIcon}
                        className='delivery-pickup-tooltip-icon'
                    />
                </Tooltip>
            </div>
            <Header
                type='fS16 fW600 text'
                className='delivery-pickup-store-address-text'>
                Store Address
            </Header>
            <div className='delivery-pickup-store-details'>
                <Icon
                    icon={storeDetails?.brandImg}
                    rounded
                    className='delivery-pickup-store-icon'
                />
                <div>
                    <Header type='fS16 fW600 text'>
                        {storeDetails?.storeName}
                    </Header>
                    <Header type='fS14 fW500 text'>
                        {storeDetails?.address?.street},{" "}
                        {storeDetails?.address?.city}
                    </Header>
                    <Header type='fS14 fW500 text'>
                        {storeDetails?.address?.post_code},{" "}
                        {storeDetails?.address?.country}
                    </Header>
                </div>
            </div>
        </Card>
    );
};

export default DeliveryPickup;
