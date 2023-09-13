import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import { updateUserShoppingListAsync } from "../../api/user/user_account";
import { updateShoppingList } from "../../redux/reducers/userReducer";
import { useState } from "react";
import Toaster from "../../components/toaster";

const ShoppingList = () => {
    const dispatch = useDispatch();
    const [shoppingList] = useSelector((states) => [
        states?.user?.cart?.shoppingList ?? {},
    ]);
    let isShoppingListEmpty = Object.keys(shoppingList)?.length <= 0;

    const [warningMessage, setWarningMessage] = useState("");

    const handleShoppingRemove = async (slId) => {
        let newList = { ...shoppingList };
        if (newList.hasOwnProperty(slId)) {
            delete newList[slId];
        }
        let res = await updateUserShoppingListAsync(newList);
        if (res?.status?.includes?.("success")) {
            dispatch(updateShoppingList(newList));
        } else {
            setWarningMessage(res?.message ?? "Try again after sometime.");
        }
    };

    return (
        <div className='shopping-list'>
            <Toaster
                className='shopping-list-error'
                variant='error'
                content={warningMessage}
                show={warningMessage}
                handleClose={() => setWarningMessage("")}
            />
            <Header className='shopping-list-header' type='fS18 fW600 text'>
                Shopping List
            </Header>
            {isShoppingListEmpty ? (
                <div className='shopping-list-empty'>
                    <Card className='shopping-list-empty-card'>
                        <Header type='fS14 fW600 text'>
                            No more items on shopping list.
                        </Header>
                    </Card>
                </div>
            ) : (
                <Card className='shopping-list-content'>
                    {Object.keys(shoppingList)?.map((item, key) => {
                        let shoppingItem = shoppingList[item];
                        return (
                            <div
                                className='shopping-list-content-item'
                                key={`${key}-list-item-key`}>
                                <Header
                                    type='fS14 fW500 text'
                                    className='shopping-list-content-item-label'>
                                    {`${shoppingItem?.name} - ${shoppingItem?.qty} ${shoppingItem?.measurement}`}
                                </Header>
                                <Button
                                    variant='primary'
                                    fontType='fS12 fW600 text'
                                    onClick={() => handleShoppingRemove(item)}>
                                    Remove
                                </Button>
                            </div>
                        );
                    })}
                </Card>
            )}
        </div>
    );
};

export default ShoppingList;
