import { useState, useEffect } from "react";
import Modal from "../../components/modal/Modal";
import Header from "../../components/header/Header";
import { useSelector } from "react-redux";
import InventoryCard from "./InventoryCard";

const CompareCartModal = ({ showModal, handleClose, inventory, storeId }) => {
    const [shoppingList, isShoppingListEmpty] = useSelector((states) => [
        states?.user?.cart?.shoppingList ?? {},
        states?.user?.cart?.totalShoppingList <= 0,
    ]);

    const [inventorySLItems, setInventorySLItems] = useState({});

    useEffect(() => {
        const inventoryKeys = Object.keys(inventory ?? {});
        const shoppingListKeys = Object.keys(shoppingList);
        let inventoryCartObj = {};
        if (inventoryKeys?.length > 0 && shoppingListKeys?.length > 0) {
            shoppingListKeys.forEach((item) => {
                if (inventoryKeys?.includes(item))
                    inventoryCartObj = {
                        ...inventoryCartObj,
                        [item]: inventory[item],
                    };
            });
            setInventorySLItems(inventoryCartObj);
        }
    }, [shoppingList, inventory]);

    const handleCloseModal = () => {
        handleClose();
    };

    return (
        <Modal
            show={showModal}
            title={
                <Header type='fS14 fW600 text'>
                    Compare Store items with Shopping List
                </Header>
            }
            onHide={handleCloseModal}
            className='compare-cart-modal'>
            <div className='compare-cart-modal-content'>
                <div className='compare-cart-modal-items'>
                    <Header
                        type='fS16 fW600 text'
                        className='compare-cart-modal-items-header'>
                        Available Items
                    </Header>
                    <div
                        className={`compare-cart-modal-items-container ${
                            Object.keys(inventorySLItems)?.length <= 0
                                ? "empty"
                                : ""
                        }`}>
                        <InventoryCard
                            emptyContent={
                                " No more required items available in store currently."
                            }
                            storeId={storeId}
                            inventoryList={inventorySLItems}
                        />
                    </div>
                </div>
                {!isShoppingListEmpty && (
                    <div className='compare-cart-modal-cart-list'>
                        <Header
                            type='fS16 fW600 text'
                            className='compare-cart-modal-cart-list-header'>
                            Shopping List
                        </Header>
                        <ul>
                            {Object.keys(shoppingList).map((item, key) => {
                                let cartQty = shoppingList?.[item]?.qty;
                                let cartMeasurement =
                                    shoppingList?.[item]?.measurement;
                                return (
                                    <li
                                        key={`${key}-cart-list-item`}
                                        className='compare-cart-modal-sl-item'>
                                        <div className='compare-cart-modal-sl-item-container'>
                                            <Header
                                                type='fS14 fW400 text'
                                                className='compare-cart-modal-sl-item-name'>
                                                {shoppingList?.[item]?.name}{" "}
                                            </Header>
                                            <Header
                                                type='fS12 fW600 text'
                                                className='compare-cart-modal-sl-item-qty'>
                                                {!cartQty
                                                    ? "- None"
                                                    : ` - ${cartQty} ${cartMeasurement}`}
                                            </Header>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CompareCartModal;
