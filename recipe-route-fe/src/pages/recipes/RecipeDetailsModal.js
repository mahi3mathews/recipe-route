import Modal from "../../components/modal/Modal";
import Header from "../../components/header/Header";
import { updateUserFavoritesAsync } from "../../api/user/user_account";
import { useState, useEffect } from "react";
import Favorite from "../../components/favorite";
import "./recipeDetails.scss";
import { useDispatch } from "react-redux";
import { updateUserFavPreferences } from "../../redux/reducers/userReducer";

const RecipeDetailsModal = ({
    showModal,
    handleCloseModal,
    recipe,
    isUserFavorite,
    handleFavClick,
}) => {
    const dispatch = useDispatch();
    const [isFavorite, setFavorite] = useState(isUserFavorite?.(recipe?.id));

    const handleFavoriteClick = async () => {
        let res = await updateUserFavoritesAsync(recipe?.id);
        if (res?.status?.includes("success")) {
            setFavorite((prevState) => !prevState);
            dispatch(updateUserFavPreferences(recipe?.id));
            handleFavClick();
        }
    };
    const handleClose = () => {
        setFavorite(null);
        handleCloseModal();
    };

    useEffect(() => {
        setFavorite(isUserFavorite(recipe?.id));
    }, [recipe?.id]);

    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            title={
                <>
                    {recipe?.title}
                    <Favorite
                        isFavorite={isFavorite}
                        handleClick={handleFavoriteClick}
                        className='recipe-details-modal-fav'
                    />
                </>
            }
            className='recipe-details-modal'>
            <div className='recipe-details-modal-description recipe-row'>
                <Header type='text fS16 fW600'>Description</Header>
                <Header type='text fS14 fW400'>{recipe?.description}</Header>
            </div>
            <div className='recipe-details-modal-ingredients recipe-row'>
                <Header type='text fS16 fW600'>Ingredients</Header>
                <ul>
                    {recipe?.ingredientsList?.map((item, key) => (
                        <li key={`${key}-recipe-ingredient`}>
                            <Header type='fS14 fW400 text'>{item}</Header>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='recipe-details-modal-directions recipe-row'>
                <Header type='text fS16 fW600'>Directions</Header>
                <ul>
                    {recipe?.directions?.map((item, key) => (
                        <li key={`${key}-recipe-direction`}>
                            <Header type='fS14 fW400 text'>{item}</Header>
                        </li>
                    ))}
                </ul>
            </div>
        </Modal>
    );
};

export default RecipeDetailsModal;
