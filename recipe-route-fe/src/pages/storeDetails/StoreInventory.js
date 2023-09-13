import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import chevDown from "../../svg/chev-down-darkAccent.svg";
import InventoryCard from "./InventoryCard";

const StoreInventory = ({ inventory, handleItemSelection, storeId }) => {
    const [renderInventory, setRenderInventory] = useState({});
    const [showSection, setShowSection] = useState({});
    const formatInventoryItems = () => {
        Object.keys(inventory).map((item) =>
            setRenderInventory((prevState) => {
                let inventoryItem = inventory[item];
                return {
                    ...prevState,
                    [inventoryItem?.item_type]: {
                        ...prevState[inventoryItem?.item_type],
                        [item]: inventoryItem,
                    },
                };
            })
        );
    };

    const formatTitle = (item) => {
        return String(item).toLowerCase().split("_").join(" & ");
    };

    const handleShowClick = (sectionName) => {
        setShowSection((prevState) => ({
            ...prevState,
            [sectionName]: !(prevState?.[sectionName] ?? false),
        }));
    };
    useEffect(() => {
        formatInventoryItems();
    }, [inventory]);
    return (
        <div className='inventory'>
            {Object.keys(renderInventory)?.map((item, key) => {
                return (
                    <div
                        className='inventory-item'
                        key={`${key}-inventory-item`}>
                        <div className='inventory-item-section-title'>
                            <Header
                                handleClick={() => handleShowClick(item)}
                                type='fS16 fW600'
                                className='inventory-item-type-title'>
                                {formatTitle(item)} Section
                            </Header>
                            <Icon
                                src={chevDown}
                                className={`inventory-item-icon ${
                                    showSection?.[item] ? "open" : "close"
                                }`}
                            />
                        </div>
                        {showSection?.[item] && (
                            <InventoryCard
                                storeId={storeId}
                                inventoryList={renderInventory[item]}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StoreInventory;
