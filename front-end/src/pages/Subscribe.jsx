import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';
import '../styles/SubscribePage.css';
import { IMAGES } from "../utils/const";
import Button from "../components/UI/button/Button";
import { subscribe } from "../API/UserService";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Subscribe = observer(() => {
    const { t } = useTranslation();
    const { user } = useContext(Context);

    const handleSubscribeButtonClick = async () => {
        try {
            const response = await subscribe();
            window.location.href = response.data.links[0].href;
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="subscribe-container">
            <div className="subscribe-headers">
                <h2>{t('subscribePage.subscriptionTitle')}</h2>
            </div>
            <div className="subscribe-image-container">
                <img
                    className="subscribe-image"
                    src={IMAGES.SUBSCRIBE_PAGE_IMAGE}
                    alt="Image not found"
                />
            </div>
            <div className="subscribe-details">
                <h3>{t('subscribePage.offeringTitle')}</h3>
                <ul>
                    <li>{t('subscribePage.offering1')}</li>
                    <li>{t('subscribePage.offering2')}</li>
                    <li>{t('subscribePage.offering3')}</li>
                    <li>{t('subscribePage.offering4')}</li>
                </ul>
            </div>
            <div className="subscribe-button-container">
                <Button
                    buttonText={t('subscribePage.subscribeButtonText')}
                    onClick={handleSubscribeButtonClick}
                    isDisable={user.getSubscription.status === 'ACTIVE' || user.getSubscription.status === 'APPROVAL_PENDING'}
                />
            </div>
            <div className="subscribe-error-container">
                {user.getSubscription.status === 'ACTIVE' || user.getSubscription.status === 'APPROVAL_PENDING' ?
                    <p>{t('subscribePage.alreadySubscribed')}</p>
                    :
                    <p></p>
                }
            </div>
        </div>
    );
});

export default Subscribe;
