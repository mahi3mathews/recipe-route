import { useState, useEffect } from "react";
import Icon from "../../components/icon/Icon";
import Input from "../../components/input/Input";
import Header from "../../components/header/Header";
import tickIcon from "../../svg/tick-primary.svg";
import closeIcon from "../../svg/close-darkAccent.svg";

const InventoryPrice = ({
    unitPrice,
    handlePriceSubmit,
    error,
    isEdit,
    handleEditClick,
}) => {
    const [price, setPrice] = useState(unitPrice);

    useEffect(() => {
        setPrice(unitPrice);
    }, [unitPrice]);

    const handleCallback = (isSuccess) => {
        if (!isSuccess) {
            setPrice(unitPrice);
        }
    };

    const handleClose = () => {
        setPrice(unitPrice);
        handleEditClick(false);
    };

    const handleSubmit = () => {
        handlePriceSubmit(Number(price).toFixed(2), handleCallback);
    };

    return isEdit ? (
        <div className='inventory-price'>
            <Input
                variant='darkAccent'
                name='unit_price'
                id='inventory_unit_price'
                type='text-number'
                value={price}
                placeholder='Unit price'
                handleChange={(e) => {
                    setPrice(e?.target?.value);
                }}
                error={error}
                className='inventory-price-input'
            />
            <div className='inventory-price-btn'>
                <Icon
                    src={closeIcon}
                    isCursor
                    className='inventory-price-close'
                    onClick={handleClose}
                />
                <Icon
                    isCursor
                    src={tickIcon}
                    className='inventory-price-submit'
                    onClick={handleSubmit}
                />
            </div>
        </div>
    ) : (
        <Header
            type='fS14 fW400 text'
            className='inventory-price-header'
            handleClick={() => handleEditClick(true)}>
            £{price}
        </Header>
    );
};

export default InventoryPrice;
