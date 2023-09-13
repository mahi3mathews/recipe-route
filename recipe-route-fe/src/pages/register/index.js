import "./register.scss";
import Card from "../../components/card/Card";
import { useFormik } from "formik";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import Icon from "../../components/icon/Icon";
import logoLight from "../../svg/logo-title.svg";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL, STORE_LOGIN_URL } from "../../constants/route_urls";
import { UserDetailsSchema } from "../../schemas/UserDetailsSchema";
import { useState } from "react";
import UserDetailsForm from "./UserDetailsForm";
import StoreDetailsForm from "./StoreDetailsForm";
import {
    StoreDetailsSchema,
    AddressSchema,
} from "../../schemas/StoreDetailsSchema";
import StoreStandardsForm from "./StoreStandardsForm";
import { registerUserAsync, registerStoreAsync } from "../../api/commonApis";

const Register = ({ isStore = false }) => {
    const navigate = useNavigate();
    const [mainErr, setMainErr] = useState("");
    const [storeMainErr, setStoreMainErr] = useState("");
    const [storeFSAError, setStoreFSAErr] = useState("");
    const [step, setStep] = useState(0);
    const [x, setX] = useState(0);

    const handleRegisterUser = async (data) => {
        setMainErr("");
        if (isStore) {
            // go to next step
            setStep((prevState) => prevState + 1);
            setX(1000);
        } else {
            // register user
            let res = await registerUserAsync(data);
            if (String(res?.status)?.includes("success")) {
                navigate(LOGIN_URL);
            } else {
                setMainErr(res?.message);
            }
        }
    };

    const handleRegisterStore = async (data) => {
        // register store
        let allData = {
            store_data: { ...data, ...storeDetailsFormik?.values },
            user_data: userDetailsFormik?.values,
        };
        let res = await registerStoreAsync(allData);
        if (String(res?.status)?.includes("success")) {
            navigate(STORE_LOGIN_URL);
        } else {
            setMainErr(res?.message);
        }
    };

    const userDetailsFormik = useFormik({
        initialValues: {
            email: "",
            password: "",
            name: "",
        },
        validationSchema: UserDetailsSchema,
        onSubmit: handleRegisterUser,
    });

    const storeDetailsFormik = useFormik({
        initialValues: {
            store_name: "",
            business_email: "",
            business_phonenumber: "",
            business_type: "",
        },
        validationSchema: StoreDetailsSchema,
        onSubmit: () => {
            setStep(2);
            setX(1000);
        },
    });
    const storeAddressFSAFormik = useFormik({
        initialValues: {
            address: {
                street: "",
                city: "",
                post_code: "",
                country: "UK",
            },
            FSA_id: "",
        },
        validationSchema: AddressSchema,
        onSubmit: handleRegisterStore,
    });

    const handlePrev = () => {
        setStep((prevState) => prevState - 1);
        setX(-1000);
    };

    const componentList = [
        <UserDetailsForm
            formik={userDetailsFormik}
            error={mainErr}
            x={x}
            btnTxt={isStore ? "Next" : "Register"}
        />,
        <StoreDetailsForm
            formik={storeDetailsFormik}
            error={storeMainErr}
            x={x}
            handlePrev={handlePrev}
        />,
        <StoreStandardsForm
            formik={storeAddressFSAFormik}
            error={storeFSAError}
            x={x}
            handlePrev={handlePrev}
        />,
    ];

    const handleLogin = () => navigate(isStore ? STORE_LOGIN_URL : LOGIN_URL);
    return (
        <div className='registration'>
            <div className='registration-container'>
                <Card className='registration-card'>
                    <div className='registration-header-container'>
                        <Icon
                            src={logoLight}
                            className='registration-header-icon'
                        />
                        <Header
                            type='fS32 fW500 lightAccent'
                            className='registration-header'>
                            {isStore ? "STORE " : ""}
                            REGISTRATION
                        </Header>
                    </div>
                    <div className='registration-content'>
                        {isStore && (
                            <div className='registration-progress-bar'>
                                <div
                                    style={{
                                        width:
                                            step === 0
                                                ? "34%"
                                                : step === 1
                                                ? "67%"
                                                : "100%",
                                    }}></div>
                            </div>
                        )}
                        {componentList[step]}
                    </div>
                    <div className='registration-register-container'>
                        <Header type='fS18 fW500 lightAccent'>
                            Already {isStore ? "registered" : "a user"}?
                        </Header>
                        <Button
                            variant='transparent'
                            fontType='fS20 fW600 lightAccent'
                            className='registration-register'
                            onClick={handleLogin}>
                            Log in
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
