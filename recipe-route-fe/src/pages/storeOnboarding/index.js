import Header from "../../components/header/Header";
import Input from "../../components/input/Input";
import { useRef, useState, useEffect } from "react";
import AddStoreInventory from "./AddStoreInventory";
import { useDispatch, useSelector } from "react-redux";
import "./store_onboarding.scss";
import { setStoreInventory } from "../../redux/reducers/storeReducer";
import {
    fetchStoreInventoryAsync,
    uploadOnboardingAsync,
} from "../../api/store/stores";
import { getIngredientsAsync } from "../../api/ingredients";
import { setIngredients } from "../../redux/reducers/ingredientReducer";
import Card from "../../components/card/Card";
import Button from "../../components/button/Button";
import { STORE_HOME_URL } from "../../constants/route_urls";
import { useNavigate } from "react-router-dom";

const StoreOnboarding = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [imageUpload, setImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [csvFilename, setCSVFilename] = useState("");
    const [csvFile, setCSVFile] = useState(null);
    const [onboardingErr, setOnboardingErr] = useState("");
    const [isOnboardingLoading, setOnboardingLoading] = useState(false);
    const imageRef = useRef(null);
    const csvRef = useRef(null);
    const handleOnboardingSubmit = async () => {
        setOnboardingLoading(true);
        let onboardingFormData = new FormData();
        onboardingFormData.append("store_image", imageUpload);
        onboardingFormData.append("csvFile", csvFile);
        let res = await uploadOnboardingAsync(onboardingFormData);
        if (res?.status?.includes?.("success")) {
            setOnboardingLoading(false);
            navigate(STORE_HOME_URL);
        } else {
            setOnboardingLoading(false);
            setOnboardingErr(res?.message);
        }
    };
    const setupStoreAsync = async () => {
        let res = await fetchStoreInventoryAsync();
        if (res?.status?.includes?.("success")) {
            dispatch(setStoreInventory(res?.data));
        }
        let res1 = await getIngredientsAsync();
        if (res1.status?.includes?.("success")) {
            dispatch(setIngredients(res1?.data));
        }
    };

    useEffect(() => {
        setupStoreAsync();
    }, []);
    const handleImageChange = (event) => {
        const file = event.target.files.item(0);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
            setImageName(file?.name ?? "Brand image");
        }
    };
    const handleFileUpload = (event) => {
        const file = event.target.files.item(0);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCSVFile(e.target.result);
            };
            reader.readAsDataURL(file);
            setCSVFilename(file?.name ?? "Inventory file");
        }
    };
    const uploadComponent = (
        id,
        accept,
        ref,
        imgName,
        placeholder,
        handleChange,
        btnText
    ) => {
        return (
            <div className='store-onboarding-image-upload'>
                <Input
                    className='store-onboarding-image-input'
                    id={id}
                    value=''
                    type='file'
                    accept={accept}
                    ref={ref}
                    handleChange={handleChange}
                />
                <label htmlFor={id} className='store-onboarding-image-label'>
                    <Header
                        type='fS12 fW600 primary'
                        className='store-onboarding-image-label-btn'>
                        {btnText}
                    </Header>
                    <Header type='fS14 fW600 text'>
                        {imgName ? imgName : placeholder}
                    </Header>
                </label>
            </div>
        );
    };
    return (
        <div className='store-onboarding'>
            <div className='store-onboarding-header-container'>
                <Header
                    className='store-onboarding-header-subtitle'
                    type='fS18 fW600 text'>
                    Upload your brand image and add inventory to start your
                    online store.
                </Header>
            </div>
            <Card className='store-onboarding-content-card'>
                <Header type='fS18 fW600 text'>Brand image:</Header>
                {uploadComponent(
                    "brand-image",
                    "image/*",
                    imageRef,
                    imageName,
                    "Select your brand image",
                    handleImageChange,
                    "Upload image"
                )}
                <Header type='fS18 fW600 text'>Inventory:</Header>
                <div className='store-onboarding-inventory-container'>
                    <AddStoreInventory
                        uploadComponent={uploadComponent(
                            "brand-inventory",
                            ".csv",
                            csvRef,
                            csvFilename,
                            "Add your inventory file",
                            handleFileUpload,
                            "Upload file"
                        )}
                    />
                </div>
                <div className='store-onboarding-submit'>
                    <Button
                        isLoading={isOnboardingLoading}
                        variant='darkAccent'
                        type='button'
                        fontType='fS14 fW600 lightAccent'
                        error={onboardingErr}
                        onClick={handleOnboardingSubmit}
                        className='store-onboarding-submit-btn'>
                        Confirm changes
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default StoreOnboarding;
