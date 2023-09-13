import { Formik } from "formik";
import { Form } from "react-bootstrap";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { motion } from "framer-motion";

const StoreDetailsForm = ({ formik, error, handlePrev, x }) => {
    const { errors, touched } = formik;

    return (
        <motion.div
            initial={{ x: x }}
            transition={{ duration: 1 }}
            animate={{ x: 0 }}>
            <Formik>
                <form onSubmit={formik.handleSubmit}>
                    <Form.Group className='registration-input-group'>
                        <Input
                            variant='lightAccent'
                            name='store_name'
                            id='registration-store_name'
                            type='text'
                            value={formik.values.store_name}
                            placeholder='Store Name'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.store_name && touched?.store_name
                                    ? errors?.store_name
                                    : ""
                            }
                        />
                    </Form.Group>

                    <Form.Group className='registration-input-group'>
                        <Input
                            variant='lightAccent'
                            name='business_email'
                            id='registration-business_email'
                            type='text'
                            value={formik.values.business_email}
                            placeholder='Business Email'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.email && touched?.email
                                    ? errors?.email
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group className='registration-input-group'>
                        <Input
                            variant='lightAccent'
                            name='business_phonenumber'
                            id='registration-business_phonenumber'
                            type='text'
                            value={formik.values.business_phonenumber}
                            placeholder='Business Phone Number'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.business_phonenumber &&
                                touched?.business_phonenumber
                                    ? errors?.business_phonenumber
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group className='registration-input-group'>
                        <Input
                            variant='lightAccent'
                            name='business_type'
                            id='registration-business_type'
                            type='text'
                            value={formik.values.business_type}
                            placeholder='Business Type'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.business_type && touched?.business_type
                                    ? errors?.business_type
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
                            Next
                        </Button>
                    </Form.Group>
                </form>
            </Formik>
        </motion.div>
    );
};

export default StoreDetailsForm;
