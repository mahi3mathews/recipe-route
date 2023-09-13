import { useEffect, useState } from "react";
import "./storeInventoryDetails.scss";
import Header from "../../components/header/Header";
import { useDispatch } from "react-redux";
import Button from "../../components/button/Button";
import { fetchStoreInventoryAsync } from "../../api/store/stores";
import { setStoreInventory } from "../../redux/reducers/storeReducer";
import InventoryTable from "./InventoryTable";
import AddInventoryModal from "./AddInventoryModal";

const StoreInventoryDetails = () => {
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);

    const setUpInventoryAsync = async () => {
        let res = await fetchStoreInventoryAsync(page);
        if (res?.status?.includes?.("success")) {
            dispatch(setStoreInventory(res?.data));
        }
    };
    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseModal = () => setShowAddModal(false);

    useEffect(() => {
        setUpInventoryAsync();
    }, [page]);

    return (
        <div className='store-inventory-details'>
            <div className='store-inventory-details-header'>
                <Header
                    type='fS21 fW600 text'
                    className='store-inventory-details-title'>
                    Store Inventory
                </Header>
                <Button
                    variant='primary'
                    fontType='fS14 fW600 lightShade'
                    onClick={handleShowAddModal}>
                    Add inventory
                </Button>
            </div>
            <InventoryTable page={page} setPage={setPage} />
            <AddInventoryModal
                showModal={showAddModal}
                handleClose={handleCloseModal}
                handleSuccess={setUpInventoryAsync}
            />
        </div>
    );
};

export default StoreInventoryDetails;
