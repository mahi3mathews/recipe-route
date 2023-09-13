import { Table } from "react-bootstrap";
import Header from "../../components/header/Header";
import { meals, days } from "../../constants/planner_constants";
import { useSelector } from "react-redux";
import { dateFormatter } from "../../utils/dateFormatter";
import Card from "../../components/card/Card";
import Skeleton from "../../components/skeleton";

const MealPlannerTable = ({
    setShowModal,
    weekFilter,
    handleRecipeModal,
    isLoading,
}) => {
    const [mealPlans] = useSelector((states) => [
        states?.mealPlans?.plans ?? {},
    ]);

    const isMealExpired = (mealDate) =>
        dateFormatter(new Date()) > dateFormatter(mealDate);

    const handleAddMeal = (mealId, mealType) => {
        setShowModal(mealId, mealType);
    };

    const weeklyMealCell = (mealPlan, mealType, key) => {
        let userMeal = mealPlan?.meals[mealType?.toUpperCase()] ?? {};
        let mealDisabled = mealPlan && isMealExpired(mealPlan?.meal_date);
        return (
            <td key={key} colSpan={2}>
                <Card
                    isCursor
                    disabled={mealDisabled || isLoading}
                    className={`meal-planner-table-cell-card`}
                    onClick={() =>
                        !userMeal?.id
                            ? handleAddMeal(
                                  dateFormatter(mealPlan?.meal_date),
                                  mealType.toUpperCase()
                              )
                            : handleRecipeModal(userMeal?.id)
                    }>
                    {isLoading ? (
                        <div className='meal-planner-table-skeleton'>
                            <Skeleton className='meal-planner-table-skeleton-title' />
                            <Skeleton className='meal-planner-table-skeleton-calories' />
                        </div>
                    ) : userMeal?.id ? (
                        <>
                            <Header type='fS16 fW600 text'>
                                {userMeal?.title}
                            </Header>
                            {userMeal?.calories && (
                                <Header type='fS12 fW500 text'>
                                    Calories: {userMeal?.calories}
                                </Header>
                            )}
                        </>
                    ) : (
                        <Header
                            type='fS16 fW600 primary'
                            className='meal-planner-table-no-meal'>
                            {mealDisabled ? "-" : "Click to add recipe!"}
                        </Header>
                    )}
                </Card>
            </td>
        );
    };

    const weeklyMeals = (weekFilterId) => {
        let weekMeal = mealPlans[weekFilterId] ?? [];
        return Object.keys(days).map((mealDay, key) => {
            let foundMealPlan = weekMeal.find(
                (item) => item?.meal_day === mealDay
            );
            return (
                <tr key={`${key}-row-meal-plan`}>
                    <td className='meal-planner-table-body-cell'>
                        <Header
                            type='text fS14 fW600'
                            className='meal-planner-table-day'>
                            <span>{mealDay}</span>
                            {foundMealPlan?.meal_date && (
                                <span>
                                    {dateFormatter(
                                        foundMealPlan?.meal_date,
                                        true
                                    )}
                                </span>
                            )}
                        </Header>
                    </td>
                    {meals["3"].map((mealType, mealKey) => {
                        return weeklyMealCell(
                            foundMealPlan,
                            mealType,
                            `${key}-${mealKey}-meal-col-item`
                        );
                    })}
                </tr>
            );
        });
    };

    return (
        <div className='meal-planner-table-container'>
            <div className='meal-planner-table-header'>
                <Header type='fS18 fW600 text'> Weekly Plan</Header>
                <Header type='fS16 fW500 text'>
                    {weekFilter?.from} - {weekFilter?.to}
                </Header>
            </div>
            <Card className='meal-planner-table-card'>
                <Table className='meal-planner-table'>
                    <thead>
                        <tr>
                            <th>{""}</th>
                            {meals["3"].map((item, key) => (
                                <th key={`${key}-meal-per-day`} colSpan={2}>
                                    <Header
                                        type='fS18 text fW600'
                                        className='meal-planner-table-column-name'>
                                        <span> {item}</span>
                                        <span>{}</span>
                                    </Header>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {weeklyMeals(`${weekFilter?.from}_${weekFilter?.to}`)}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};

export default MealPlannerTable;
