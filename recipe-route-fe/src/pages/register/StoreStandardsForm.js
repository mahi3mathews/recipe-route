import { Formik } from "formik";
import { Form } from "react-bootstrap";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { motion } from "framer-motion";

const StoreStandardsForm = ({ formik, error, x, handlePrev }) => {
    const { errors, touched } = formik;
    const { address } = formik?.values ?? {};

    return (
        <motion.div
            initial={{ x: x }}
            transition={{ duration: 1 }}
            animate={{ x: 0 }}>
            <Formik>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}>
                    <Form.Group className='registration-input-group'>
                        <Input
                            variant='lightAccent'
                            name='address.street'
                            id='registration-street'
                            type='text'
                            value={address?.street}
                            placeholder='Street Address'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.address?.street &&
                                touched?.address?.street
                                    ? errors?.address?.street
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group className='registration-input-group'>
                        <Input
                            variant='lightAccent'
                            name='address.city'
                            id='registration-city'
                            type='text'
                            value={address?.city}
                            placeholder='City'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.address?.city && touched?.address?.city
                                    ? errors?.address?.city
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group className='registration-input-group country-postcode'>
                        <Input
                            variant='lightAccent'
                            name='address.country'
                            id='registration-country'
                            type='text'
                            disabled
                            value={address?.country}
                        />
                        <Input
                            variant='lightAccent'
                            name='address.post_code'
                            id='registration-post_code'
                            type='text'
                            value={address?.post_code}
                            placeholder='Zip code'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.address?.post_code &&
                                touched?.address?.post_code
                                    ? errors?.address?.post_code
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group className='registration-input-group'>
                        <Input
                            variant='lightAccent'
                            name='FSA_id'
                            id='registration-FSA_id'
                            type='text'
                            value={formik.values.FSA_id}
                            placeholder='FSA Identification Number'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.FSA_id && touched?.FSA_id
                                    ? errors?.FSA_id
                                    : ""
                            }
                        />
                    </Form.Group>

                    <Form.Group className='registration-submit-group second-form'>
                        <Button
                            fontType='fS18 fW600 darkAccent'
                            variant='lightAccent'
                            type='button'
                            className='registration-submit previous'
                            error={error}
                            onClick={handlePrev}>
                            Previous
                        </Button>
                        <Button
                            fontType='fS18 fW600 darkAccent'
                            variant='lightAccent'
                            type='submit'
                            className='registration-submit'
                            error={error}>
                            Register Store
                        </Button>
                    </Form.Group>
                </form>
            </Formik>
        </motion.div>
    );
};

export default StoreStandardsForm;
