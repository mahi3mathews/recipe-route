import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { CART_URL, USER_ORDERS_URL } from "../../constants/route_urls";
import Toaster from "../../components/toaster";
import StripePayment from "./StripePayment";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setupStripeAsync,
    updateStripePaymentAsync,
} from "../../api/stripePayments";
import { resetCartAndStore } from "../../redux/reducers/userReducer";

const PaymentDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalPayment] = useSelector((states) => [
        states?.user?.cart?.totalPrice ?? 0,
    ]);
    let tries = 0;
    const [clientSecret, setClientSecret] = useState("");
    const [stripePromise, setStripePromise] = useState("");
    const [errMessage, setErrorMessage] = useState("");

    const getTotalPriceInPence = (totalAmt) =>
        Number(Math.round(totalAmt * 100).toFixed(2));
    const setUpStripeConfig = async () => {
        let res = await setupStripeAsync(getTotalPriceInPence(totalPayment));

        if (res?.status?.includes?.("success")) {
            setClientSecret(res?.data);
        } else {
            setErrorMessage("Failed to connect with stripe. Please try again.");
        }
    };
    useEffect(() => {
        if (totalPayment > 0) setUpStripeConfig();
        else navigate(CART_URL);
    }, [totalPayment]);

    useEffect(() => {
        setStripePromise(loadStripe(process.env.REACT_APP_STRIPE_P_KEY));
    }, []);

    const handlePaymentFailure = (errMessage) => {
        setErrorMessage(errMessage);
    };

    const handlePaymentSuccess = async (paymentId) => {
        let res = await updateStripePaymentAsync(paymentId);
        if (res?.status?.includes?.("success")) {
            dispatch(resetCartAndStore());
            navigate(USER_ORDERS_URL);
        } else {
            if (tries < 2) {
                tries += 1;
                handlePaymentSuccess(paymentId);
            }
            return;
        }
    };

    return (
        <div className='payment-details-container'>
            <Toaster
                handleClose={() => setErrorMessage("")}
                show={errMessage ? true : false}
                variant='error'
                content={errMessage}
            />
            <Card className='payment-details'>
                <Header type='fS18 fW600 text'>Payment Details</Header>
                <div className='payment-details-content'>
                    <StripePayment
                        isReady={stripePromise && clientSecret}
                        stripe={stripePromise}
                        options={{ clientSecret }}
                        handleSuccess={handlePaymentSuccess}
                        handleFailure={handlePaymentFailure}
                        totalPrice={totalPayment}
                    />
                </div>
            </Card>
        </div>
    );
};

export default PaymentDetails;
