import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required"),
});
