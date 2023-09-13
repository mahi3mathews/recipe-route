import { Formik, useFormik } from "formik";
import Input from "../../components/input/Input";
import { UserProfileSchema } from "../../schemas/UserDetailsSchema";
import { updateUserAsync } from "../../api/user/user_account";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../../redux/reducers/userReducer";
import Button from "../../components/button/Button";
import { useState } from "react";

const UserProfileForm = ({ userDetails, setError, handleClose }) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const updateUserDetailsAsync = async (values) => {
        setLoading(true);
        let res = await updateUserAsync(values);
        if (res?.status?.includes?.("success")) {
            dispatch(updateUserDetails(values));
            handleClose();
            setLoading(false);
        } else {
            setError(res?.message ?? "Failed to update information.");
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: userDetails?.name ?? "",
            email: userDetails?.email ?? "",
            phone_number: userDetails?.phone_number ?? "",
        },
        validationSchema: UserProfileSchema,
        onSubmit: updateUserDetailsAsync,
    });
    const { errors, touched } = formik;
    return (
        <div className='user-details-form'>
            <Formik>
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        variant='darkAccent'
                        name='name'
                        id='user_name'
                        type='text'
                        value={formik.values.name}
                        placeholder='Name'
                        handleBlur={formik.handleBlur}
                        handleChange={formik.handleChange}
                        error={
                            errors?.name && touched?.name ? errors?.name : ""
                        }
                    />
                    <Input
                        variant='darkAccent'
                        name='email'
                        id='user_email'
                        type='text'
                        value={formik.values.email}
                        placeholder='Email'
                        handleBlur={formik.handleBlur}
                        handleChange={formik.handleChange}
                        error={
                            errors?.email && touched?.email ? errors?.email : ""
                        }
                    />
                    <Input
                        variant='darkAccent'
                        name='phone_number'
                        id='user_phno'
                        type='text'
                        value={formik.values.phone_number}
                        placeholder='Phone number'
                        handleBlur={formik.handleBlur}
                        handleChange={formik.handleChange}
                        error={
                            errors?.phone_number && touched?.phone_number
                                ? errors?.phone_number
                                : ""
                        }
                    />
                    <Button
                        isLoading={isLoading}
                        type='submit'
                        variant='primary'
                        className='user-details-submit-btn'
                        fontType='fS14 fW600 lightShade'>
                        Update
                    </Button>
                </form>
            </Formik>
        </div>
    );
};

export default UserProfileForm;
