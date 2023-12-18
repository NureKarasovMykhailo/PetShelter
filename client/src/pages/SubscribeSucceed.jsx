import React, {useContext, useEffect} from 'react';
import Button from "../components/UI/button/Button";
import {useNavigate} from "react-router-dom";
import {MAIN_ROUTE} from "../utils/const";
import '../styles/SubscribeSucceed.css';
import {checkAuth, getToken} from "../API/UserService";
import { observer} from "mobx-react-lite";
import {Context} from "../index";

const SubscribeSucceed = observer(() => {
    const navigate = useNavigate();
    const { user } = useContext(Context)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                localStorage.setItem('token', token)
            } catch (error) {
                console.log(error)
            }

        };

        fetchData().then();
    }, []);

    return (
        <div className={"subscribe-succeed-container"}>
            <div className="subscribe-succeed-container__header">
                <h2>Дякуємо</h2>
            </div>
            <div className="subscribe-succeed-container__details">
                <p>Ви успішно оформили підписку на місяць!</p>
            </div>
            <div className="subscribe-succeed-container__button">
                <Button
                    buttonText={"На головну"}
                    onClick={() => navigate(MAIN_ROUTE)}
                />
            </div>
        </div>
    );
});

export default SubscribeSucceed;