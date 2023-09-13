import "./login.scss";
import Card from "../../components/card/Card";
import { Formik, useFormik } from "formik";
import { Form } from "react-bootstrap";
import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import Icon from "../../components/icon/Icon";
import logoLight from "../../svg/logo-title.svg";
import { useNavigate } from "react-router-dom";
import {
    STORE_HOME_URL,
    STORE_REGISTER_URL,
    USER_HOME_URL,
    USER_REGISTER_URL,
} from "../../constants/route_urls";
import { LoginSchema } from "../../schemas/LoginSchema";
import { loginAsync } from "../../api/commonApis";
import { useState } from "react";
import {
    setUserDetailPreferences,
    setUserDetails,
} from "../../redux/reducers/userReducer";
import { useDispatch } from "react-redux";
import { setStoreDetails } from "../../redux/reducers/storeReducer";

const Login = ({ isStore = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [mainErr, setMainErr] = useState("");

    const handleLogin = async (data) => {
        let res = await loginAsync(data, isStore);
        if (res?.status?.includes("fail")) {
            setMainErr(res?.message);
        } else if (res?.data) {
            if (!isStore) {
                dispatch(setUserDetailPreferences(res?.data));
            } else {
                dispatch(
                    setUserDetailPreferences({
                        ...(res?.data?.store_user ?? {}),
                        img: res?.data?.store_details?.brandImg,
                    })
                );
                dispatch(setStoreDetails(res?.data?.store_details));
            }
            navigate(!isStore ? USER_HOME_URL : STORE_HOME_URL);
        }
    };
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: handleLogin,
        validationSchema: LoginSchema,
    });
    const { errors, touched } = formik;

    const handleRegisterClick = () =>
        navigate(isStore ? STORE_REGISTER_URL : USER_REGISTER_URL);

    return (
        <div className='login'>
            <div className='login-container'>
                <Card className='login-card'>
                    <div className='login-header-container'>
                        <Icon src={logoLight} className='login-header-icon' />
                        <Header
                            type='fS32 fW500 lightShade'
                            className='login-header'>
                            {isStore ? "STORE " : ""}LOG IN
                        </Header>
                    </div>
                    <Formik>
                        <form onSubmit={formik.handleSubmit}>
                            <Form.Group className='login-input-group'>
                                <Input
                                    variant='lightShade'
                                    name='email'
                                    id='login-email'
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
                            <Form.Group className='login-input-group'>
                                <Input
                                    variant='lightShade'
                                    name='password'
                                    id='login-password'
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
                            <Form.Group className='login-submit-group'>
                                <Button
                                    fontType='fS18 fW600 text'
                                    variant=''
                                    type='submit'
                                    error={mainErr}
                                    className='login-submit'>
                                    Login
                                </Button>
                            </Form.Group>
                        </form>
                    </Formik>
                    <div className='login-register-container'>
                        <Header type='fS18 fW500 lightShade'>
                            Not {isStore ? "registered" : "a user"}?
                        </Header>
                        <Button
                            variant='transparent'
                            fontType='fS18 fW600 lightShade'
                            className='login-register'
                            onClick={handleRegisterClick}>
                            Sign up
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
