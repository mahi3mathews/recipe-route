import { store_order_status } from "../../constants/order_status";
import { useState } from "react";
import Dropdown from "../../components/dropdown/Dropdown";
import { updateOrderStatus } from "../../api/store/stores";

const StoreStatusDropdown = ({ orderItem }) => {
    const [status, setStatus] = useState(orderItem?.status ?? "");
    const handleUpdateStatus = async (id, status) => {
        setStatus(status);
        let res = await updateOrderStatus(id, status);
        if (res?.status?.includes?.("success")) {
        } else {
            setStatus(orderItem?.status);
        }
    };
    return (
        <Dropdown
            className='store-order-status-drop'
            showChev
            variant='transparent'
            handleChange={(data) =>
                handleUpdateStatus(orderItem?.id, data?.value)
            }
            value={store_order_status[status]}
            menu={Object.keys(store_order_status).map((item) => ({
                title: item.toLowerCase(),
                data: { value: item },
            }))}
        />
    );
};

export default StoreStatusDropdown;
