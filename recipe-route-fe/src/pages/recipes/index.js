import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/header/Header";
import RecipeCard from "../userHome/RecipeCard";
import "./recipes.scss";
import { useState, useEffect } from "react";
import RecipeDetailsModal from "./RecipeDetailsModal";
import { getPersonalizedRecipesAsync } from "../../api/recipes";
import { setRecipes } from "../../redux/reducers/recipeReducer";
import Pagination from "../../components/pagination";

const Recipes = () => {
    const dispatch = useDispatch();
    const [recipes, userFavs, totalCount] = useSelector((states) => [
        states?.recipes?.list,
        states?.user?.preferences?.favorites ?? [],
        states?.recipes?.pagination?.totalRecords ?? 0,
    ]);
    const [showModal, setShowModal] = useState(false);
    const [recipeDetails, setRecipeDetails] = useState({});
    const [isRecipeFav, setFavorite] = useState(false);
    const [page, setPage] = useState(1);

    const handleDisplayRecipDetails = (recipe) => {
        setShowModal(true);
        setRecipeDetails(recipe);
        setFavorite(userFavs?.includes(recipe?.id));
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setRecipeDetails({});
        setFavorite(false);
    };
    const handleFavCheck = () => isRecipeFav;

    const handlePageChange = (pageNo) => setPage(pageNo);

    const getRecommendationsAsync = async (page = 1) => {
        let data = await getPersonalizedRecipesAsync(page);
        if (data?.status?.includes("success")) {
            dispatch(setRecipes(data));
        }
    };
    useEffect(() => {
        getRecommendationsAsync(page);
    }, [page]);

    return (
        <div className='recipe-list-view'>
            <div className='recipe-list-header-container'>
                <Header type='fS20 fW600 text' className='recipe-list-header'>
                    Recipe Recommendations
                </Header>
                <div className='recipe-list-header-add-recipe'>
                    {/* <Icon src={plus} className='recipe-list-header-add-icon' />
                    <Header type='fs14 fW600 primary'>Add Recipe</Header> */}
                </div>
            </div>
            <RecipeDetailsModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                recipe={recipeDetails}
                isUserFavorite={handleFavCheck}
                handleFavClick={() => getRecommendationsAsync(page)}
            />
            <div className='recipe-list-container'>
                {recipes?.map((item, key) => (
                    <div
                        className='recipe-list-card-container'
                        key={`${key}-recipe-card`}>
                        <RecipeCard
                            data={item}
                            isDisplayCard
                            handleCardClick={() =>
                                handleDisplayRecipDetails(item)
                            }
                        />
                    </div>
                ))}
            </div>
            <div className='recipe-list-pagination-container'>
                <Pagination
                    className='recipe-list-pagination-pagination'
                    page={page}
                    total={totalCount}
                    changePage={handlePageChange}
                />
            </div>
        </div>
    );
};

export default Recipes;
