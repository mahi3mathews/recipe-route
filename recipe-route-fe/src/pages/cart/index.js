import { useSelector } from "react-redux";
import Header from "../../components/header/Header";
import "./cart.scss";
import CartTable from "./CartTable";
import ShoppingList from "./ShoppingList";

const Cart = () => {
    const [totalCart, cartList, shoppingList, totalCartPrice] = useSelector(
        (states) => [
            states?.user?.cart?.totalCartItems,
            states?.user?.cart?.cartList ?? {},
            states?.user?.cart?.shoppingList ?? {},
            states?.user?.cart?.totalPrice ?? 0,
        ]
    );

    return (
        <div className='cart-view'>
            <div className='cart-content'>
                <CartTable list={cartList} totalPrice={totalCartPrice} />
                <ShoppingList shoppingList={shoppingList} />
            </div>
        </div>
    );
};

export default Cart;
