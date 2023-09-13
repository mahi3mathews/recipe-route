import * as Yup from "yup";

export const UserDetailsSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Required"),
    name: Yup.string()
        .matches(
            /^[a-zA-Z0-9\s.-]*$/,
            "Only alphabets, numbers, hyphens, and periods are allowed"
        )
        .required("Required"),
    password: Yup.string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required("Required"),
});

export const UserProfileSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Required"),
    name: Yup.string()
        .matches(
            /^[a-zA-Z0-9\s.-]*$/,
            "Only alphabets, numbers, hyphens, and periods are allowed"
        )
        .required("Required"),
    phone_number: Yup.string()
        .matches(
            /^(\+44\s?|0)(?:(?:\d{5}\s?\d{3}\s?\d{4})|(?:\d{4}\s?\d{6})|(?:\d{3}\s?\d{3}\s?\d{4})|(?:\d{4}\s?\d{4}))$/,
            "Provide valid UK contact number"
        )
        .required("Required"),
});
