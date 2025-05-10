import React, { useContext, useEffect } from 'react';
import Button from "../components/UI/button/Button";
import { useNavigate } from "react-router-dom";
import { MAIN_ROUTE } from "../utils/const";
import '../styles/SubscribeSucceed.css';
import { getToken } from "../API/UserService";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const SubscribeSucceed = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const { t } = useTranslation(); // Use the useTranslation hook to access the t function

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                localStorage.setItem('token', token);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData().then();
    }, []);

    return (
        <div className={"subscribe-succeed-container"}>
            <div className="subscribe-succeed-container__header">
                <h2>{t('subscribeSucceedPage.header')}</h2>
            </div>
            <div className="subscribe-succeed-container__details">
                <p>{t('subscribeSucceedPage.successMessage')}</p>
            </div>
            <div className="subscribe-succeed-container__button">
                <Button
                    buttonText={t('subscribeSucceedPage.homeButton')}
                    onClick={() => navigate(MAIN_ROUTE)}
                />
            </div>
        </div>
    );
});

export default SubscribeSucceed;
