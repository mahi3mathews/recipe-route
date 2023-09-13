export const getCartTotalItems = (cartItems) => {
    let cartCounts = Object.values(cartItems ?? {});
    if (cartCounts?.length === 1) {
        return cartCounts[0]["qty"];
    }
    if (cartCounts?.length > 0) {
        return cartCounts?.reduce(
            (prevValue, currentValue) =>
                Number(prevValue?.qty ?? prevValue ?? 0) +
                Number(currentValue?.qty ?? 0)
        );
    } else return 0;
};

export const getCartTotalPrice = (cartItems) => {
    let cartCounts = Object.values(cartItems ?? {});
    if (cartCounts?.length === 1) {
        return cartCounts[0]["total_price"];
    }
    if (cartCounts?.length > 0) {
        return cartCounts?.reduce((prevValue, currentValue) => {
            return Number(
                Number(
                    Number(prevValue?.total_price ?? prevValue ?? 0).toFixed(2)
                ) + Number(Number(currentValue?.total_price ?? 0).toFixed(2))
            ).toFixed(2);
        });
    } else return 0;
};
