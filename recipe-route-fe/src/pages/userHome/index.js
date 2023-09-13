import { useDispatch, useSelector } from "react-redux";
import {
    getPersonalizedRecipesAsync,
    getRecipeDetailsAsync,
} from "../../api/recipes";
import {
    setRecipes,
    updateRecipeCache,
} from "../../redux/reducers/recipeReducer";
import { updateMealPlanRecipe } from "../../redux/reducers/mealPlannerReducer";
import "./user_home.scss";
import { useEffect, useState } from "react";
import MealPlannerTable from "./MealPlannerTable";
import MealPlannerModal from "./MealPlannerModal";
import { addRecipeToPlanAsync } from "../../api/mealplanner";
import RecipeDetailsModal from "../recipes/RecipeDetailsModal";
import chevDark from "../../svg/chev-down-darkAccent.svg";
import Icon from "../../components/icon/Icon";
import { updateMealPlans } from "../../redux/reducers/mealPlannerReducer";
import { getUserMealPlansAsync } from "../../api/mealplanner";
import Header from "../../components/header/Header";

const UserHome = () => {
    const dispatch = useDispatch();

    const [showAddModal, setShowAddModal] = useState(false);
    const [addMealDate, setAddMealDate] = useState("");
    const [addMealType, setAddMealType] = useState("");
    const [addRecipeErr, setAddRecipeError] = useState("");
    const [weekFilter, setWeekFilter] = useState({});
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [recipeDetails, setRecipeDetails] = useState({});
    const [pageNo, setPageNo] = useState(1);
    const [mealLoading, setMealLoading] = useState(false);

    const [recipes, recipeCacheList, totalRecipes, userFavs] = useSelector(
        (states) => [
            states?.recipes?.list ?? [],
            states?.recipes?.cacheList ?? {},
            states?.recipes?.pagination?.totalRecords ?? 0,
            states?.user?.preferences?.favorites ?? [],
        ]
    );

    const getRecommendationsAsync = async (page = 1) => {
        let data = await getPersonalizedRecipesAsync(page);
        if (data?.status?.includes("success")) {
            dispatch(setRecipes(data));
        }
    };

    const fetchUserMeal = async (filter) => {
        setMealLoading(true);
        let res = await getUserMealPlansAsync(filter ?? weekFilter);

        if (res?.status?.includes("success")) {
            dispatch(
                updateMealPlans({
                    mealPlanWeek: `${filter?.from}_${filter?.to}`,
                    mealPlans: res?.data,
                })
            );
        }
        setTimeout(() => setMealLoading(false), 1000);
    };

    const getWeekFilter = (filterChange) => {
        let weekDate = weekFilter?.from ?? new Date();
        if (filterChange === "current") {
            weekDate = new Date();
            weekDate.setDate(
                weekDate.getDate() - ((weekDate.getDay() + 1) % 7)
            );
        } else if (filterChange === "next") {
            weekDate = new Date(weekFilter?.to);
            weekDate.setDate(weekDate.getDate() + 1);
        } else if (filterChange === "prev") {
            weekDate = new Date(weekFilter?.from);
            weekDate.setDate(weekDate.getDate() - 7);
        }

        let startOfWeek = new Date(weekDate);
        let endOfWeek = new Date(weekDate);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        let formattedStartDate = startOfWeek.toISOString().split("T")[0];
        let formattedEndDate = endOfWeek.toISOString().split("T")[0];
        setWeekFilter({ from: formattedStartDate, to: formattedEndDate });
    };

    useEffect(() => {
        getWeekFilter("current");
    }, []);
    useEffect(() => {
        if (weekFilter?.from && weekFilter?.to) fetchUserMeal(weekFilter);
    }, [weekFilter]);
    useEffect(() => {
        getRecommendationsAsync(pageNo);
    }, [pageNo]);

    const handleCloseRecipeModal = () => {
        setShowRecipeModal(false);
    };
    const handleShowRecipeModal = async (recipeId) => {
        let foundRecipe = recipes.find((item) => item?.id === recipeId);
        let foundCacheRecipe = recipeCacheList[recipeId];
        if (!foundRecipe && !foundCacheRecipe) {
            let res = await getRecipeDetailsAsync(recipeId);
            if (res?.status?.includes("success")) {
                setRecipeDetails(res?.data);
                dispatch(updateRecipeCache(res?.data));
            }
        } else {
            setRecipeDetails(foundRecipe ? foundRecipe : foundCacheRecipe);
        }
        setShowRecipeModal(true);
    };

    const handleFavoriteCheck = (recipeId) =>
        userFavs.find((id) => recipeId === id) ? true : false;

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setAddMealDate("");
        setAddMealType("");
        setAddRecipeError("");
    };
    const handleShowAddModal = (mealDate, mealType) => {
        setShowAddModal(true);
        setAddMealDate(mealDate);
        setAddMealType(mealType);
    };
    const handleAddRecipeToPlan = async (recipeId, is_add_to_cart) => {
        const res = await addRecipeToPlanAsync({
            recipe_id: recipeId,
            meal_date: addMealDate,
            is_add_to_cart,
            meal_type: addMealType,
        });

        if (res?.status && res?.status?.includes("success")) {
            handleCloseAddModal();
            dispatch(
                updateMealPlanRecipe({
                    mealDate: addMealDate,
                    recipe: res?.data,
                    weekFilter,
                    mealType: addMealType,
                })
            );
        } else {
            setAddRecipeError("Failed to add recipe. Try again");
        }
    };

    return (
        <div className='user-home'>
            <Header className='user-home-header' type='fS20 fW600 text'>
                Meal Planner
            </Header>
            <MealPlannerModal
                submitErr={addRecipeErr}
                showModal={showAddModal}
                closeModal={handleCloseAddModal}
                recipes={recipes}
                handleSubmit={handleAddRecipeToPlan}
                handlePageChange={setPageNo}
                totalCount={totalRecipes}
                page={pageNo}
            />
            <RecipeDetailsModal
                recipe={recipeDetails}
                showModal={showRecipeModal}
                handleFavClick={() => getRecommendationsAsync()}
                isUserFavorite={handleFavoriteCheck}
                handleCloseModal={handleCloseRecipeModal}
            />
            <div className='user-home-planner-container'>
                <div className='user-home-meal-planner-left'>
                    <Icon
                        isCursor
                        onClick={() => getWeekFilter("prev")}
                        src={chevDark}
                        className='user-home-planner-left-icon'
                    />
                </div>
                <MealPlannerTable
                    isLoading={mealLoading}
                    handleRecipeModal={handleShowRecipeModal}
                    setWeekFilter={setWeekFilter}
                    weekFilter={weekFilter}
                    setShowModal={handleShowAddModal}
                />
                <div className='user-home-meal-planner-right'>
                    <Icon
                        isCursor
                        onClick={() => getWeekFilter("next")}
                        src={chevDark}
                        className='user-home-planner-right-icon'
                    />
                </div>
            </div>
        </div>
    );
};

export default UserHome;
