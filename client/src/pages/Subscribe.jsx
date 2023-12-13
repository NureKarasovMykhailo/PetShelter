import React from "react";
import '../styles/subscribe.css';
import {IMAGES} from "../utils/const";
import Button from "../components/UI/button/Button";
import {subscribe} from "../API/UserService";

const Subscribe = () => {
    const handleSubscribeButtonClick = async  () => {
        try {
            const response = await subscribe();
            window.location.href = response.data.links[0].href;
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="subscribeContainer">
            <div className="subscribeHeaders">
                <h2>Оформлення підписки</h2>
            </div>
            <div className="subscribeImageContainer">
                <img
                    className="subscribeImage"
                    src={IMAGES.SUBSCRIBE_PAGE_IMAGE}
                    alt="Image not found"
                />
            </div>
            <div className="subscribeDetails">
                <h3>Що ми пропануємо:</h3>
                <ul>
                    <li>Створення власного корпоративного домену для вашого притулку;</li>
                    <li>Введення обліку тварин та вашого притулку;</li>
                    <li>Зручний спосіб відстежування стану ваших тварин;</li>
                    <li>Зручний механізм створень оголошень про оформлення опікунства над тваринами;</li>
                </ul>
            </div>
            <div className="subscribeButtonContainer">
                <Button
                    buttonText="Оформити підписку 9,99$ / 31 день"
                    onClick={handleSubscribeButtonClick}
                />
            </div>
        </div>
    );
};

export default Subscribe;