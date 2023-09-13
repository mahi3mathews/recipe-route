export const phoneFormatter = (phoneNumber) => {
    if (phoneNumber) {
        const cleanedNumber = phoneNumber.replace(/\D/g, "");

        const formattedNumber = cleanedNumber.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "($1) $2-$3"
        );
        return formattedNumber;
    } else return null;
};
