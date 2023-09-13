import { useEffect, useState } from "react";
import Onboarding from "../onboardingUser";
import UserDetails from "./UserDetails";
import "./userProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import Toaster from "../../components/toaster";
// import { updateUserActivity } from "../../redux/reducers/userReducer";
// import { getUserActivityAsync } from "../../api/user/user_account";
// import UserActivity from "./UserActivity";

const UserProfile = () => {
    const dispatch = useDispatch();
    const [activityDetails] = useSelector((states) => [states?.user?.activity]);
    const [toasterErr, setToasterErr] = useState("");

    const fetchOrderSummaryAsync = async () => {
        // let res = await getUserActivityAsync();
        // if (res?.status?.includes?.("success")) {
        //     dispatch(updateUserActivity(res?.data));
        // } else {
        //     setToasterErr(res?.message);
        // }
    };
    useEffect(() => {
        fetchOrderSummaryAsync();
    }, [activityDetails]);
    return (
        <div className='user-profile'>
            <Toaster
                handleClose={() => setToasterErr("")}
                show={toasterErr ? true : false}
                variant='error'
                content={toasterErr}
            />
            <div className='user-profile-container'>
                <div className='user-profile-order-container'>
                    <UserDetails />
                    {/* <UserActivity activtiy={activityDetails} /> */}
                </div>
                <Onboarding hideHeader showPreferences />
            </div>
        </div>
    );
};

export default UserProfile;
