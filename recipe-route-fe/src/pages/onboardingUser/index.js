import "./onboarding.scss";

import Header from "../../components/header/Header";
import Accordion from "../../components/accordion/Accordion";
import Checkbox from "../../components/checkbox/Checkbox";
import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { setIngredients } from "../../redux/reducers/ingredientReducer";
import { updateUserPreferencesAsync } from "../../api/user/user_account";
import { USER_HOME_URL } from "../../constants/route_urls";
import { useNavigate } from "react-router-dom";
import { getIngredientsAsync } from "../../api/ingredients";
import { ingredientTypes } from "../../constants/ingredients_list";

const Onboarding = ({ hideHeader = false, showPreferences = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [allergenList, setAllergenList] = useState([]);
    const [ingredientList, userAllergenList] = useSelector((states) => [
        states?.ingredients?.list ?? {},
        states?.user?.preferences?.allergens_and_not_preferred ?? [],
    ]);

    useEffect(() => {
        if (showPreferences && userAllergenList?.length > 0) {
            setAllergenList(userAllergenList);
        }
    }, [showPreferences, userAllergenList]);
    const handleAllergenSelect = (id, isChecked) => {
        setAllergenList((prevState) => {
            let newState = [...prevState];
            if (isChecked) {
                newState.push(id);
            } else newState = [...prevState.filter((item) => item !== id)];

            return newState;
        });
    };

    let renderAllergenCheck = (item, key) => (
        <div className='onboarding-allergen-item' key={`${key}-allergen-item`}>
            {item?.id === "ADD" ? (
                <div></div>
            ) : (
                <Checkbox
                    label={item?.label ?? item?.name}
                    variant='primary'
                    headerVariant='fS12 fW400 text'
                    checked={allergenList?.includes(item?.id)}
                    handleSelect={(isChecked) =>
                        handleAllergenSelect(item?.id, isChecked)
                    }
                />
            )}
        </div>
    );

    const getIngredientContent = (type) => {
        let foundIngredientList = Object.keys(ingredientList).find(
            (item) => item === type
        );
        if (foundIngredientList) {
            return ingredientList[foundIngredientList].map((item, key) =>
                renderAllergenCheck(item, key)
            );
        }
    };
    const fetchAllIngredients = async () => {
        let res = await getIngredientsAsync();
        if (res?.status?.includes("success")) {
            dispatch(setIngredients(res?.data));
        }
    };
    useEffect(() => {
        fetchAllIngredients();
    }, []);

    const handleSubmitPreference = async () => {
        // make api call to user preferences api
        let data = await updateUserPreferencesAsync({
            allergens_and_not_preferred: allergenList,
            is_onboarding_complete: true,
        });
        if (data?.status === "success") {
            navigate(USER_HOME_URL);
        }
    };

    return (
        <div className='onboarding'>
            {!hideHeader && (
                <div className='onboarding-header'>
                    <Header type='fS21 fW600 text'>
                        Provide your non-preferences and allergens
                    </Header>
                </div>
            )}
            <Card>
                <div className='onboarding-content'>
                    <div className='onboarding-allergen-container'>
                        <Header type='fS18 fW700 text'>
                            Allergens/Not Preferred
                        </Header>
                    </div>
                    <div className='onboarding-allergen-accordion-container'>
                        <Accordion
                            labels={ingredientTypes}
                            content={getIngredientContent}
                            showDrop
                        />
                    </div>
                </div>
            </Card>
            <div className='onboarding-total-selected'>
                <Header type='fS18 fW600 text'>
                    {allergenList?.length} selected
                </Header>
            </div>
            <div className='onboarding-footer'>
                <Button
                    fontType='fS18 fW600 text'
                    variant='primary'
                    type='submit'
                    className='login-submit'
                    onClick={handleSubmitPreference}>
                    Submit preferences
                </Button>
            </div>
        </div>
    );
};

export default Onboarding;
