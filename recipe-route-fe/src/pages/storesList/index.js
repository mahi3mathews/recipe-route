import { useSelector, useDispatch } from "react-redux";
import "./storesList.scss";
import { fetchStoresAsync } from "../../api/store/stores";
import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { setStoreList } from "../../redux/reducers/storeReducer";
import Card from "../../components/card/Card";
import Icon from "../../components/icon/Icon";
import { useNavigate } from "react-router-dom";
import { STORE_DETAILS_URL } from "../../constants/route_urls";

const StoresList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [stores] = useSelector((states) => [states?.stores?.storeList ?? []]);
    const [page, setPage] = useState(1);

    const fetchStoresListAsync = async () => {
        let res = await fetchStoresAsync(page);
        if (res?.status?.includes("success")) {
            dispatch(setStoreList(res?.data));
        }
    };

    const handleStoreDetails = (storeId) => {
        navigate(`${STORE_DETAILS_URL}/${storeId}`);
    };

    useEffect(() => {
        fetchStoresListAsync();
    }, []);

    return (
        <div className='stores-list'>
            <Header className='stores-list-header' type='fS20 fW600 text'>
                All Stores
            </Header>
            <div className='stores-list-content'>
                {stores?.map((item, key) => (
                    <div
                        key={`${key}-store-item`}
                        className='stores-list-store-container'>
                        <Card
                            className='stores-list-store-card'
                            isCursor
                            onClick={() => handleStoreDetails(item?.id)}>
                            <div className='stores-list-brandimg'>
                                <Icon
                                    src={item?.brandImg}
                                    className='stores-list-brandimg-icon'
                                />
                            </div>
                            <div className='stores-list-store-title'>
                                <Header type='fS18 fW600 text'>
                                    {item?.storeName}
                                </Header>
                            </div>
                            <div className='stores-list-store-address'>
                                <Header type='fS12 fW500 text'>
                                    {item?.address?.street},{" "}
                                    {item?.address?.city}
                                </Header>
                                <Header type='fS12 fW500 text'>
                                    {item?.address?.post_code},{" "}
                                    {item?.address?.country}
                                </Header>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoresList;
