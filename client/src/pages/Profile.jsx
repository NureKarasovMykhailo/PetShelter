import React, {useContext, useEffect, useState} from 'react';
import {getProfileInfo, getSubscriptionDetail} from "../API/UserService";
import {Context} from "../index";
import '../styles/Profile.css';
import Loader from "../components/UI/loader/Loader";
import Button from "../components/UI/button/Button";
import UnderlineLink from "../components/UI/link/underlineLink/UnderlineLink";
import {useNavigate} from "react-router-dom";
import {MAIN_ROUTE, SUBSCRIBE_ROUTE} from "../utils/const";
import Modal from "../components/UI/modal/Modal";
import UserImageForm from "../components/forms/userImageForm/UserImageForm";
import {observer} from "mobx-react-lite";

const Profile = observer(() => {
    const [modalActive, setModalActive] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(Context);
    const padWithZero = (value) => value.toString().padStart(2, '0');

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await getProfileInfo();
            const subscribeData = await getSubscriptionDetail();
            return {userData, subscribeData};
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

    const startTime = new Date(user.getSubscription.start_time);
    const formattedStartTime = `${padWithZero(startTime.getDate())}.${padWithZero(startTime.getMonth() + 1)}.${startTime.getFullYear()}`;
    const endTime = new Date(startTime);
    endTime.setDate(startTime.getDate() + 31);
    const formattedEndTime = `${endTime.getDate()}.${endTime.getMonth() + 1}.${endTime.getFullYear()}`;

    const birthday = new Date(user.user.birthday);
    const formattedBirthday = `${padWithZero(birthday.getDate())}.${padWithZero(birthday.getMonth() + 1)}.${birthday.getFullYear()}`;

    let userFields = [
        {name: 'Логін:', value: user.user.login},
        {name: 'Email:', value: user.user.email},
        {name: 'Корпоративний адрес:', value: user.user.domain_email},
        {name: 'Дата народження:', value: formattedBirthday},
        {name: 'Номер телефона:', value: user.user.phone_number},
    ];
    userFields = userFields.filter(userField => userField.value !== null);


    return (
        isLoading
            ?
            <div className="profileContainer">
                <div className="profileImageRow">
                    <div className="profileImageContainer">
                        <img
                            className="profileImage"
                            src={process.env.REACT_APP_API_URL + user.user.user_image}
                            alt="Image not found"
                        />
                    </div>
                    <div className="subscribeContainer">
                        {user.getSubscription.status === 'ACTIVE'
                            ?
                            <p><b>Підписка: </b>Активна з <b>{formattedStartTime}</b> до <b>{formattedEndTime}</b></p>
                            :
                            <div className="subscribeLinkContainer">
                                <p className="nonSubscribeInfo"><b>Підписка: </b>Не активна</p>
                                <UnderlineLink
                                    linkText="Оформити підписку"
                                    onClick={handleSubscribeLinkClick}
                                />
                            </div>
                        }
                        <div className="profileLogOutBtnContainer">
                            <Button
                                buttonText="Вихід"
                                onClick={handleLogOutBtnClick}
                            />
                        </div>
                    </div>
                </div>
                <div className="changeImageLinkContainer">
                    <UnderlineLink
                        linkText="Змінити зображення"
                        onClick={handleImageChangeClick}
                    />
                </div>
                <div className="profileUserInfoContainer">
                    <div className="profileUserFullNameContainer">
                        <p>{user.user.full_name}</p>
                    </div>
                    <div className="profileUserFieldsContainer">
                        {userFields.map((userField, index) =>
                            <div key={index} className="profileUserFieldContainer">
                                <div className="profileUserFieldName">
                                    {userField.name}
                                </div>
                                <div className="profileUserFieldValue">
                                    {userField.value}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="profileButtonsContainer">
                    <div className="profileButtonContainer">
                        <Button
                            buttonText="Притулок"
                        />
                    </div>
                    <div className="profileButtonContainer">
                        <Button
                            buttonText="Змінити email"
                        />
                    </div>
                    <div className="profileButtonContainer">
                        <Button
                            buttonText="Змінити пароль"
                        />
                    </div>
                    <div className="profileButtonContainer">
                        <Button
                            buttonText="Змінити телефон"
                        />
                    </div>
                </div>
                <Modal active={modalActive} setActive={setModalActive} >
                    <UserImageForm />
                </Modal>
            </div>
            :
            <Loader />

    );
});

export default Profile;