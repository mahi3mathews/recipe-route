import { useState, useEffect } from "react";
import Modal from "../../components/modal/Modal";
import RecipeCard from "./RecipeCard";
import { PaginationControl } from "react-bootstrap-pagination-control";
import Pagination from "../../components/pagination";

const MealPlannerModal = ({
    showModal,
    submitErr,
    handleSubmit,
    closeModal,
    recipes,
    totalCount,
    page = 1,
    handlePageChange,
}) => {
    const [selectedRecipe, setSelectedRecipe] = useState("");
    const [itemCheckId, setItemCheckId] = useState({});

    const handleRecipeSelection = (recipeId) => {
        setSelectedRecipe(recipeId);
        if (itemCheckId && itemCheckId !== recipeId) setItemCheckId("");
    };

    const handleCloseModal = (resetData) => {
        setSelectedRecipe("");
        if (!resetData) closeModal();
    };

    const handleItemCartSelect = (checked, recipeId) => {
        setItemCheckId(checked ? recipeId : "");
    };

    useEffect(() => {
        if (!showModal) handleCloseModal(true);
    }, [showModal]);

    return (
        <Modal
            className='add-meal-plan-modal'
            show={showModal}
            title='Recipes for Meal Plan'
            footerBtn='Add recipe to Plan'
            onHide={handleCloseModal}
            submitError={submitErr}
            submitBtn={{
                fontType: "fS18 fW600 lightShade",
                variant: "darkAccent",
                type: "button",
                className: "add-meal-plan-modal-submit",
                onClick: () =>
                    handleSubmit(
                        selectedRecipe,
                        itemCheckId === selectedRecipe
                    ),
            }}>
            <div>
                {recipes?.map((item, key) => (
                    <div key={`${key}-recipe-card`}>
                        <RecipeCard
                            isItemCart={itemCheckId === item?.id}
                            setItemCart={(checked) =>
                                handleItemCartSelect(checked, item?.id)
                            }
                            data={item}
                            isSelected={selectedRecipe === item?.id}
                            handleSelection={() =>
                                handleRecipeSelection(item?.id)
                            }
                        />
                    </div>
                ))}
            </div>
            <Pagination
                className='add-meal-plan-modal-pagination'
                page={page}
                total={totalCount}
                changePage={handlePageChange}
            />
        </Modal>
    );
};

export default MealPlannerModal;
