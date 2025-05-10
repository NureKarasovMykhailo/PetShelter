import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProfileInfo, getSubscriptionDetail, sendConfirmationCode } from "../API/UserService";
import { Context } from "../index";
import '../styles/Profile.css';
import Loader from "../components/UI/loader/Loader";
import Button from "../components/UI/button/Button";
import UnderlineLink from "../components/UI/link/underlineLink/UnderlineLink";
import { useNavigate } from "react-router-dom";
import { CHANGE_PASSWORD_PAGE, CHECK_AUTH_ROUTE, MAIN_ROUTE, SHELTER_ROUTE, SUBSCRIBE_ROUTE } from "../utils/const";
import Modal from "../components/UI/modal/Modal";
import UserImageForm from "../components/forms/userImageForm/UserImageForm";
import { observer } from "mobx-react-lite";
import CheckAuthPage from "./CheckAuthPage";

const Profile = observer(() => {
    const { t } = useTranslation();
    const [modalActive, setModalActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(Context);

    const padWithZero = (value) => value.toString().padStart(2, '0');

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await getProfileInfo();
            const subscribeData = await getSubscriptionDetail();
            return { userData, subscribeData };
        }
        fetchUserData().then(response => {
            user.setUser(response.userData.data);
            user.setSubscription(response.subscribeData.data.message);
            setIsLoading(true);
        });
    }, []);

    const navigate = useNavigate();
    const handleSubscribeLinkClick = () => {
        navigate(SUBSCRIBE_ROUTE);
    }
    const handleLogOutBtnClick = () => {
        localStorage.removeItem('token');
        user.setUser(false);
        user.setIsAuth(false);
        user.setSubscription(false);
        navigate(MAIN_ROUTE);
    }
    const handleImageChangeClick = () => {
        setModalActive(true);
    }
    const handleChangePasswordClick = async () => {
        const state = { isAuth: true };
        await sendConfirmationCode(user.user.email);
        navigate(CHANGE_PASSWORD_PAGE, { state });
    }

    const handleChangeEmailBtnClick = () => {
        const state = { email: true };
        navigate(CHECK_AUTH_ROUTE, { state })
    }

    const handleChangePhoneBtnClick = () => {
        const state = { phone: true };
        navigate(CHECK_AUTH_ROUTE, { state });
    }

    const handleShelterBtnClick = () => {
        navigate(SHELTER_ROUTE);
    }
    console.log(user)
    const startTime = new Date(user.getSubscription.start_time);
    const formattedStartTime = `${padWithZero(startTime.getDate())}.${padWithZero(startTime.getMonth() + 1)}.${startTime.getFullYear()}`;
    const endTime = new Date(startTime);
    endTime.setDate(startTime.getDate() + 31);
    const formattedEndTime = `${endTime.getDate()}.${endTime.getMonth() + 1}.${endTime.getFullYear()}`;

    const birthday = new Date(user.user.birthday);
    const formattedBirthday = `${padWithZero(birthday.getDate())}.${padWithZero(birthday.getMonth() + 1)}.${birthday.getFullYear()}`;

    let userFields = [
        { name: t('loginLabel'), value: user.user.login },
        { name: t('emailLabel'), value: user.user.email },
        { name: t('domainEmailLabel'), value: user.user.domain_email },
        { name: t('birthdayLabel'), value: formattedBirthday },
        { name: t('phoneNumberLabel'), value: user.user.phone_number },
    ];
    userFields = userFields.filter(userField => userField.value !== null);

    return (
        isLoading
            ? <div className="profile-container">
                <div className="profile-image-row">
                    <div className="profile-image-container">
                        <img
                            className="profile-image"
                            src={process.env.REACT_APP_API_URL + user.user.user_image}
                            alt="Image not found"
                        />
                    </div>
                    <div className="subscribe-container">
                        {user.getSubscription.status === 'ACTIVE' || user.getSubscription.status === 'APPROVAL_PENDING'
                            ? <p><b>{t('subscribePage.subscriptionTitle')}</b> {formattedStartTime} {t('to')} {formattedEndTime}</p>
                            : <div className="subscribe-link-container">
                                <UnderlineLink
                                    linkText={t('subscribePage.subscribeButtonText')}
                                    onClick={handleSubscribeLinkClick}
                                />
                            </div>
                        }
                        <div className="profile-log-out-btn-container">
                            <Button
                                buttonText={t('logoutLabel')}
                                onClick={handleLogOutBtnClick}
                            />
                        </div>
                    </div>
                </div>
                <div className="change-image-link-container">
                    <UnderlineLink
                        linkText={t('changeImageLabel')}
                        onClick={handleImageChangeClick}
                    />
                </div>
                <div className="profile-user-info-container">
                    <div className="profile-user-full-name-container">
                        <p>{user.user.full_name}</p>
                    </div>
                    <div className="profile-user-fields-container">
                        {userFields.map((userField, index) =>
                            <div key={index} className="profile-user-field-container">
                                <div className="profile-user-field-name">
                                    {userField.name}
                                </div>
                                <div className="profile-user-field-value">
                                    {userField.value}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="profile-buttons-container">
                    <div className="profile-button-container">
                        <Button
                            buttonText={t('shelterLabel')}
                            onClick={handleShelterBtnClick}
                        />
                    </div>
                    <div className="profile-button-container">
                        <Button
                            buttonText={t('changeEmailLabel')}
                            onClick={handleChangeEmailBtnClick}
                        />
                    </div>
                    <div className="profile-button-container">
                        <Button
                            buttonText={t('changePasswordLabel')}
                            onClick={handleChangePasswordClick}
                        />
                    </div>
                    <div className="profile-button-container">
                        <Button
                            buttonText={t('changePhoneLabel')}
                            onClick={handleChangePhoneBtnClick}
                        />
                    </div>
                </div>
                <Modal active={modalActive} setActive={setModalActive} >
                    <UserImageForm />
                </Modal>
            </div>
            : <Loader />
    );
});

export default Profile;




