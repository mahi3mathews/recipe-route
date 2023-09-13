import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Tooltip from "../../components/tooltip";
import Icon from "../../components/icon/Icon";
import infoIcon from "../../svg/info-primary.svg";
import proPicPlaceholder from "../../svg/userIcon-darkAccent.svg";
import Button from "../../components/button/Button";
import { useState } from "react";
import { addUserAddress } from "../../redux/reducers/userReducer";
import { updateUserAsync } from "../../api/user/user_account";
import AddAddressForm from "./AddAddress";
import editPrimary from "../../svg/edit-primary.svg";
import UserProfileForm from "./UserProfileForm";

const UserDetails = ({ setErrToast }) => {
    const dispatch = useDispatch();
    const [userDetails] = useSelector((states) => [states?.user?.userDetails]);
    const [showAddAddr, setShowAddAddr] = useState(false);
    const [isEdit, setEdit] = useState(false);

    const handleAddAddress = () => setShowAddAddr(true);
    const handleCloseAddAddress = () => setShowAddAddr(false);

    const addAddressAsync = async (values) => {
        let res = await updateUserAsync(values);
        if (res?.status?.includes?.("success")) {
            dispatch(addUserAddress(values));
            handleCloseAddAddress();
        } else {
            setErrToast(res?.message ?? "Failed to add address.");
        }
    };
    return (
        <Card className='user-details'>
            <div className='user-details-header'>
                <Header type='fS18 fW600 text'>User Profile</Header>
                <Icon
                    src={editPrimary}
                    className='user-details-header-edit'
                    isCursor
                    onClick={() => setEdit(true)}
                />
            </div>
            <div className='user-details-personal-details'>
                <div className='user-details-image-container'>
                    <Icon
                        className='user-details-image'
                        {...(userDetails?.profile_pic
                            ? { icon: userDetails?.profile_pic }
                            : { src: proPicPlaceholder })}
                    />
                    {!userDetails?.profile_pic && (
                        <Header type='fS12 fW600 text'> Upload picture</Header>
                    )}
                </div>
                {!isEdit ? (
                    <div className='user-details-name'>
                        <Header
                            className='user-details-row'
                            type='fS16 fW400 text'>
                            <b>Name:</b> {userDetails?.name}
                        </Header>
                        <Header
                            className='user-details-row'
                            type='fS16 fW400 text'>
                            <b>Email:</b> {userDetails?.email}
                        </Header>
                        <div className='user-details-phone-number user-details-row'>
                            <Header
                                type='fS16 fW400 text'
                                className='user-details-ph-number-content'>
                                <b>Phone number: </b>
                                {userDetails?.phone_number ??
                                    " Not added yet. "}
                                {!userDetails?.phone_number && (
                                    <Tooltip
                                        className='user-details-phone-tooltip'
                                        content={
                                            <Header
                                                type='fS14 fW500 primary'
                                                className='user-details-phone-tooltip-content'>
                                                Phone number is required for
                                                online orders.
                                            </Header>
                                        }>
                                        <Icon
                                            src={infoIcon}
                                            className='user-details-phone-tooltip-icon'
                                        />
                                    </Tooltip>
                                )}
                            </Header>
                        </div>
                    </div>
                ) : (
                    <UserProfileForm
                        setError={setErrToast}
                        userDetails={userDetails}
                        handleClose={() => setEdit(false)}
                    />
                )}
            </div>
            <div className='user-details-address-container'>
                <Header type='fS16 fW600 text'>Home Address</Header>
                {!userDetails?.address?.street ? (
                    showAddAddr ? (
                        <AddAddressForm
                            addAddressAsync={addAddressAsync}
                            addressDetails={userDetails?.address}
                        />
                    ) : (
                        <div className='user-details-address-empty'>
                            <Button
                                fontType='fS14 fW600 text'
                                onClick={handleAddAddress}
                                variant='primary'>
                                Add Address
                            </Button>
                        </div>
                    )
                ) : (
                    <UserAddress address={userDetails?.address} />
                )}
            </div>
        </Card>
    );
};

const UserAddress = ({ address }) => {
    return (
        <div className='address-details'>
            <Header type='fS14 fW500 text'>
                {address?.street}, {address?.city}
            </Header>
            <Header type='fS14 fW500 text'>
                {address?.post_code}, {address?.country}
            </Header>
        </div>
    );
};

export default UserDetails;
