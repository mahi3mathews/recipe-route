import Header from "../../components/header/Header";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import Button from "../../components/button/Button";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const StripePayment = ({
    isReady,
    stripe,
    options,
    handleSuccess,
    handleFailure,
    totalPrice,
}) => {
    if (isReady) {
        return (
            <div className='stripe-payment'>
                <Elements stripe={stripe} options={options}>
                    <StripePaymentBody
                        handleFailure={handleFailure}
                        handleSuccess={handleSuccess}
                        totalPrice={totalPrice}
                    />
                </Elements>
            </div>
        );
    } else
        return (
            <Header type='fS14 fW600 error' className='stripe-payment-unloaded'>
                Stripe is not set up yet. Please refresh the page and try again.
            </Header>
        );
};

const StripePaymentBody = ({ handleFailure, handleSuccess, totalPrice }) => {
    const stripeAPI = useStripe();
    const elements = useElements();
    const [stripeLoading, setStripeLoading] = useState(false);
    const handlePayment = async () => {
        setStripeLoading(true);
        const { error, paymentIntent } = await stripeAPI.confirmPayment({
            elements,
            redirect: "if_required",
        });
        if (
            paymentIntent?.status?.includes?.("succeeded") &&
            paymentIntent?.id
        ) {
            handleSuccess(paymentIntent?.id);
        } else {
            handleFailure(error?.message ?? "Payment failed");
        }
        setStripeLoading(false);
    };
    return (
        <div className='stripe-payment-body'>
            <PaymentElement id='strip-payment-element' />
            <div className='stripe-payment-submit'>
                <Button
                    className='stripe-payment-submit-btn'
                    variant='primary'
                    fontType='fS14 fW600 lightShade'
                    onClick={handlePayment}
                    isLoading={stripeLoading}>
                    Pay £{totalPrice}
                </Button>
            </div>
        </div>
    );
};

export default StripePayment;
