import { Formik } from "formik";
import { Form } from "react-bootstrap";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { motion } from "framer-motion";

const UserDetailsForm = ({ formik, error, btnTxt, x }) => {
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
                            name='name'
                            id='registration-name'
                            type='text'
                            value={formik.values.name}
                            placeholder='Name'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.name && touched?.name
                                    ? errors?.name
                                    : ""
                            }
                        />
                    </Form.Group>

                    <Form.Group className='registration-input-group'>
                        <Input
                            variant='lightAccent'
                            name='email'
                            id='registration-email'
                            type='text'
                            value={formik.values.email}
                            placeholder='Email'
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
                            name='password'
                            id='registration-password'
                            type='password'
                            value={formik.values.password}
                            placeholder='Password'
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={
                                errors?.password && touched?.password
                                    ? errors?.password
                                    : ""
                            }
                        />
                    </Form.Group>
                    <Form.Group className='registration-submit-group'>
                        <Button
                            fontType='fS18 fW600 darkAccent'
                            variant='lightAccent'
                            type='submit'
                            className='registration-submit'
                            error={error}>
                            {btnTxt}
                        </Button>
                    </Form.Group>
                </form>
            </Formik>
        </motion.div>
    );
};

export default UserDetailsForm;
