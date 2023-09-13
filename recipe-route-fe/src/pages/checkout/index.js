import OrderSummary from "./OrderSummary";
import PaymentDetails from "./PaymentDetails";
import DeliveryPickup from "./DeliveryPickup";
import "./checkout.scss";
import { CART_URL } from "../../constants/route_urls";
import { useNavigate } from "react-router-dom";
import GoBack from "../../components/goBack";

const Checkout = () => {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(CART_URL);
    return (
        <div className='checkout-container'>
            <GoBack
                handleClick={handleGoBack}
                variant='primary'
                content='Cart'
            />
            <div className='checkout'>
                <div className='checkout-left'>
                    <DeliveryPickup />
                    <PaymentDetails />
                </div>
                <div className='checkout-right'>
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
