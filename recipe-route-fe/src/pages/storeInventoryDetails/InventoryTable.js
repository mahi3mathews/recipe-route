import { useEffect, useState } from "react";
import {
    INVENTORY_SMALL_TABLE_COLUMNS,
    INVENTORY_TABLE_COLUMNS,
} from "../../constants/inventory_table";
import useScreenSize from "../../hooks/useScreenSize";
import "./storeInventoryDetails.scss";
import { Table } from "react-bootstrap";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/button/Button";
import InventoryPrice from "./InventoryPrice";
import { updateInventoryItemAsync } from "../../api/store/stores";
import { updateInventory } from "../../redux/reducers/storeReducer";
import StockQty from "./StockQty";
import Pagination from "../../components/pagination";

const InventoryTable = ({ page, setPage }) => {
    const dispatch = useDispatch();
    const { width } = useScreenSize();

    const [columns, setColumns] = useState(INVENTORY_TABLE_COLUMNS);
    const [isPriceEdit, setPriceEdit] = useState({});
    const [error, setError] = useState({});
    const [isLoading, setLoading] = useState({});

    useEffect(() => {
        if (width <= 900) {
            setColumns(INVENTORY_SMALL_TABLE_COLUMNS);
        } else {
            setColumns(INVENTORY_TABLE_COLUMNS);
        }
    }, [width]);

    const [inventory, totalRecords] = useSelector((states) => [
        states?.stores?.inventory ?? [],
        states?.stores?.totalInventory ?? 0,
    ]);

    const handleAddInventoryFile = async () => {};

    const handleEditPrice = (show, id) =>
        setPriceEdit((prevState) => ({
            ...prevState,
            [id]: show,
        }));
    const setPriceLoading = (isLoad, id) =>
        setLoading((prevState) => ({ ...prevState, [id]: isLoad }));

    const handleInventoryDetailsAsync = async (inventoryDetails, callback) => {
        let res = await updateInventoryItemAsync(inventoryDetails);
        if (res?.status?.includes?.("success")) {
            dispatch(updateInventory(inventoryDetails));
            callback && callback(inventoryDetails, true);
        } else {
            setError((prevState) => ({
                ...prevState,
                [inventoryDetails?.item_id]:
                    res?.message ?? "Something went wrong",
            }));
            callback && callback(inventoryDetails);
        }
    };

    const handlePriceSubmit = (itemDetails, isSuccess, callback) => {
        setPriceLoading(false, itemDetails?.item_id);
        handleEditPrice(!isSuccess, itemDetails?.item_id);
        callback(isSuccess);
    };

    const getInventoryCell = (inventoryDetails, cellType) => {
        let item_id = inventoryDetails?.item_id;
        switch (cellType) {
            case "Item Name":
                return (
                    <Header type='fS14 fW500 text'>
                        {inventoryDetails?.item_name}
                    </Header>
                );
            case "Stock Quantity":
            case "Stock Qty":
                return (
                    <StockQty
                        qty={inventoryDetails?.stock_qty}
                        updateInventory={(qty, callback) =>
                            handleInventoryDetailsAsync(
                                { ...inventoryDetails, stock_qty: qty },
                                callback
                            )
                        }
                    />
                );
            case "Measurement":
                return (
                    <Header type='fS14 fW500 text'>
                        {inventoryDetails?.qty_measurement}
                    </Header>
                );
            case "Category":
                return (
                    <Header type='fS14 fW500 text'>
                        {inventoryDetails?.item_type}
                    </Header>
                );
            case "Supplier":
                return (
                    <Header type='fS14 fW500 text'>
                        {inventoryDetails?.stock_supplier}
                    </Header>
                );
            case "Unit price":
                return (
                    <InventoryPrice
                        isEdit={isPriceEdit[item_id]}
                        unitPrice={inventoryDetails?.unit_price}
                        isLoading={isLoading[item_id]}
                        handlePriceSubmit={(price, callback) => {
                            setPriceLoading(true, item_id);
                            handleInventoryDetailsAsync(
                                {
                                    ...inventoryDetails,
                                    unit_price: price,
                                },
                                (details, isSuccess) =>
                                    handlePriceSubmit(
                                        details,
                                        isSuccess,
                                        callback
                                    )
                            );
                        }}
                        handleEditClick={(isEdit) =>
                            handleEditPrice(isEdit, item_id)
                        }
                        error={error[item_id]}
                    />
                );
        }
    };

    return (
        <div className='inventory-table-container'>
            {" "}
            <Table striped className='inventory-table'>
                <thead>
                    <tr>
                        {columns.map((item, key) => (
                            <th
                                colSpan={1}
                                key={`${key}-item-column-head`}
                                className='inventory-table-column-header'>
                                <Header
                                    type='fS18 fW600 text'
                                    className='inventory-table-column-header'>
                                    {item}
                                </Header>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {inventory?.length > 0 ? (
                        inventory.map((rowItem, rKey) => {
                            return (
                                <tr key={`${rKey}-row-inventory`}>
                                    {columns.map((column, cKey) => (
                                        <td
                                            colSpan={1}
                                            key={`${rKey}-${cKey}-cell-inventory`}>
                                            {getInventoryCell(rowItem, column)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns?.length}>
                                <div className='inventory-table-empty-state'>
                                    <Header type='fS16 fW600 text'>
                                        Inventory is empty. You can upload your
                                        inventory in CSV format.
                                    </Header>
                                    <Button
                                        type='button'
                                        onClick={handleAddInventoryFile}
                                        variant='primary'
                                        fontType='fW600 fW14 lightShade'>
                                        Add Inventory
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Pagination
                limit={25}
                page={page}
                total={totalRecords}
                changePage={(page) => setPage(page)}
            />
        </div>
    );
};

export default InventoryTable;
