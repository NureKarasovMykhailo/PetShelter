import React, {useContext} from "react";
import '../styles/SubscribePage.css';
import { IMAGES } from "../utils/const";
import Button from "../components/UI/button/Button";
import { subscribe } from "../API/UserService";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Subscribe = observer(() => {
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
                <h2>Оформлення підписки</h2>
            </div>
            <div className="subscribe-image-container">
                <img
                    className="subscribe-image"
                    src={IMAGES.SUBSCRIBE_PAGE_IMAGE}
                    alt="Image not found"
                />
            </div>
            <div className="subscribe-details">
                <h3>Що ми пропануємо:</h3>
                <ul>
                    <li>Створення власного корпоративного домену для вашого притулку;</li>
                    <li>Введення обліку тварин та вашого притулку;</li>
                    <li>Зручний спосіб відстежування стану ваших тварин;</li>
                    <li>Зручний механізм створень оголошень про оформлення опікунства над тваринами;</li>
                </ul>
            </div>
            <div className="subscribe-button-container">
                <Button
                    buttonText="Оформити підписку 9,99$ / 31 день"
                    onClick={handleSubscribeButtonClick}
                    isDisable={user.getSubscription.status === 'ACTIVE' || user.getSubscription.status === 'APPROVAL_PENDING'}
                />
            </div>
            <div className="subscribe-error-container">
                {user.getSubscription.status === 'ACTIVE' || user.getSubscription.status === 'APPROVAL_PENDING' ?
                    <p>У вас вже присутня активна підписка</p>
                    :
                    <p></p>
                }
            </div>
        </div>
    );
});

export default Subscribe;
