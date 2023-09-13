import Button from "../../components/button/Button";
import { Formik, useFormik } from "formik";
import { AddressSchema } from "../../schemas/StoreDetailsSchema";
import Input from "../../components/input/Input";

const AddAddressForm = ({ addAddressAsync, addressDetails }) => {
    const formik = useFormik({
        initialValues: {
            address: {
                street: addressDetails?.street ?? "",
                city: addressDetails?.citry ?? "",
                post_code: addressDetails?.post_code ?? "",
                country: addressDetails?.country ?? "UK",
            },
        },
        onSubmit: addAddressAsync,
        validationSchema: AddressSchema,
    });
    const { errors, touched, values } = formik;
    return (
        <div className='add-address'>
            <Formik>
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        variant='darkAccent'
                        name='address.street'
                        id='address-street'
                        type='text'
                        value={values?.address?.street}
                        placeholder='Street Address'
                        handleBlur={formik.handleBlur}
                        handleChange={formik.handleChange}
                        error={
                            errors?.street && touched?.street
                                ? errors?.street
                                : ""
                        }
                    />
                    <Input
                        variant='darkAccent'
                        name='address.city'
                        id='address-city'
                        type='text'
                        value={values?.address?.city}
                        placeholder='City'
                        handleBlur={formik.handleBlur}
                        handleChange={formik.handleChange}
                        error={
                            errors?.city && touched?.city ? errors?.city : ""
                        }
                    />
                    <div className='add-address-last-line'>
                        <Input
                            variant='darkAccent'
                            name='address.post_code'
                            id='address-post_code'
                            type='text'
                            value={values?.address?.post_code}
                            placeholder='Post Code'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.post_code && touched?.post_code
                                    ? errors?.post_code
                                    : ""
                            }
                        />
                        <Input
                            variant='darkAccent'
                            name='address.country'
                            disabled
                            id='address-country'
                            type='text'
                            value={values?.address?.country}
                            placeholder='Country'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.country && touched?.country
                                    ? errors?.country
                                    : ""
                            }
                        />
                    </div>
                    <Button
                        fontType='fS14 fW600 lightShade'
                        type='submit'
                        className='add-address-submit-btn'
                        variant='primary'>
                        Add address
                    </Button>
                </form>
            </Formik>
        </div>
    );
};
export default AddAddressForm;
