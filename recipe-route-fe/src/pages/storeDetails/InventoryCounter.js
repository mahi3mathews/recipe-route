import "./inventoryCounter.scss";
import Header from "../../components/header/Header";

const InventoryCounter = ({
    inventoryItemId,
    inventoryItemDetails,
    itemQtyList,
    setItemQtyList,
    setPrevState,
}) => {
    const getCartFields = (inventoryDetails) => ({
        qty: inventoryDetails?.qty,
        unit_price: inventoryDetails?.unit_price,
        name: inventoryDetails?.name
            ? inventoryDetails?.name
            : `${inventoryDetails?.item_name} - ${inventoryDetails?.qty_measurement}`,
        img: inventoryDetails?.img,
        total_price: (
            Number(inventoryDetails?.unit_price).toFixed(2) *
            Number(inventoryDetails?.qty)
        ).toFixed(2),
    });
    const handleCartClick = (qty) => {
        if (qty >= 0) {
            let updatedQty = {
                ...itemQtyList,
                [inventoryItemId]: getCartFields({
                    ...inventoryItemDetails,
                    qty,
                }),
            };
            setPrevState((prevState) => [...prevState, itemQtyList]);
            setItemQtyList(updatedQty);
        }
    };

    return (
        <div className='inventory-counter'>
            <Header
                handleClick={() =>
                    handleCartClick(
                        Number(itemQtyList[inventoryItemId]?.qty ?? 0) + 1
                    )
                }
                type='fS16 fW600 primary'
                className='inventory-counter-qty-section-btn add'>
                +
            </Header>
            <Header
                type='fS18 fW400 text'
                className='inventory-counter-qty-section-display'>
                {itemQtyList[inventoryItemId]?.qty ?? 0}
            </Header>
            <Header
                handleClick={() =>
                    handleCartClick(
                        Number(itemQtyList[inventoryItemId]?.qty ?? 0) - 1
                    )
                }
                type='fS16 fW600 primary'
                className='inventory-counter-qty-section-btn drop'>
                -
            </Header>
        </div>
    );
};

export default InventoryCounter;
