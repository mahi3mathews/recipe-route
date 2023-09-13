import { useSelector } from "react-redux";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import cart from "../../svg/cart-primary.svg";
import "./cartIcon.scss";

const CartIcon = () => {
    let [cartCount] = useSelector((states) => [
        states?.user?.cart?.totalCartItems,
    ]);
    return (
        <div className='cart-icon-container'>
            <Icon src={cart} />
            {cartCount > 0 && (
                <Header type='fS10 fW600 primary'>{cartCount}</Header>
            )}
        </div>
    );
};

export default CartIcon;
