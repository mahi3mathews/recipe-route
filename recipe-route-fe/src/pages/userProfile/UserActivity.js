import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import "./userActivity.scss";

const UserActivity = ({ activtiy }) => {
    return (
        <Card className='user-activity'>
            <Header type='fS18 fW600 text'>User Activity</Header>
            <div className='user-activity-total'>
                <Header type='fS14 fW600 text'>Total Spent:</Header>
                <Header
                    type='fS14 fW400 text'
                    className='user-activity-total-amt'>
                    {" "}
                    £{activtiy?.total_spent ?? "0.00"}
                </Header>
            </div>
            <div className='user-activity-ingredient-graph'></div>
        </Card>
    );
};
export default UserActivity;
