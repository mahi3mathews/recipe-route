import * as Yup from "yup";

export const StoreDetailsSchema = Yup.object().shape({
    business_email: Yup.string()
        .email("Invalid email format")
        .required("Required"),
    business_type: Yup.string().required("Required"),
    store_name: Yup.string()
        .matches(
            /^[a-zA-Z0-9\s.-]*$/,
            "Only alphabets, numbers, hyphens, and periods are allowed"
        )
        .required("Required"),
    business_phonenumber: Yup.string()
        .matches(
            /^(\+44\s?|0)(?:(?:\d{5}\s?\d{3}\s?\d{4})|(?:\d{4}\s?\d{6})|(?:\d{3}\s?\d{3}\s?\d{4})|(?:\d{4}\s?\d{4}))$/,
            "Provide valid UK contact number"
        )
        .required("Required"),
});

export const AddressSchema = Yup.object().shape({
    address: Yup.object().shape({
        street: Yup.string().required("Required"),
        city: Yup.string()
            .matches(/^[A-Za-z\s.-]+$/)
            .required("Required"),
        country: Yup.string().required("Required"),
        post_code: Yup.string()
            .matches(
                /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
                "Invalid postcode"
            )
            .required("Required"),
    }),
});
