import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Checkbox from "../../components/checkbox/Checkbox";
import Button from "../../components/button/Button";
import Icon from "../../components/icon/Icon";
import chevDark from "../../svg/chev-down-darkAccent.svg";
import { useState } from "react";

const RecipeCard = ({
    data,
    isSelected,
    handleSelection,
    isItemCart,
    setItemCart,
    isDisplayCard,
    handleCardClick,
}) => {
    let { title, description, calories, ingredientsList } = data;

    const [showDetails, setShowDetails] = useState(false);

    return (
        <Card
            isCursor={handleCardClick ? true : false}
            onClick={handleCardClick && handleCardClick}
            className={`recipe-card ${isSelected ? "selected" : ""}`}
            variant='primary-faded'>
            <div
                className='recipe-card-title'
                onClick={() =>
                    isDisplayCard
                        ? setShowDetails((prevState) => !prevState)
                        : {}
                }>
                <Header type='fS18 fW600 text'>{title}</Header>
                {!isDisplayCard && (
                    <Icon
                        src={chevDark}
                        className={`recipe-card-title-icon ${
                            showDetails ? "open" : "close"
                        }`}
                    />
                )}
            </div>
            <Header className='recipe-card-desc' type='fS16 fW400 text'>
                {description}
            </Header>
            <Header
                className='recipe-card-calories'
                type={`fS16 fW500 ${isSelected ? "lightShade" : "primary"} `}>
                Calories: {calories}
            </Header>
            {showDetails && (
                <>
                    <Header className='fS16 fW400'>Ingredients</Header>
                    <ul>
                        {ingredientsList.map((ingredient, key) => (
                            <li key={`${key}-ingredient-list`}>
                                <Header type='fS14 fW500 text'>
                                    {ingredient}
                                </Header>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {!isDisplayCard && (
                <>
                    {isSelected && (
                        <Checkbox
                            className='recipe-card-checkbox'
                            label='Add available items to shopping list'
                            headerVariant='fS12 fW500'
                            variant='lightAccent'
                            checked={isItemCart}
                            handleSelect={setItemCart}
                        />
                    )}
                    {!isSelected && (
                        <Button
                            fontType={`fS12 fW600 ${
                                isSelected ? "lightShade" : "primary"
                            }`}
                            variant='darkAccent'
                            type='submit'
                            className='recipe-card-select'
                            onClick={handleSelection}>
                            Select
                        </Button>
                    )}
                </>
            )}
        </Card>
    );
};

export default RecipeCard;
