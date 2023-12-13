import React, {useContext, useState} from 'react';
import Button from "../components/UI/button/Button";
import MyInput from '../components/UI/input/MyInput';
import "../styles/Auth.css";
import {MAIN_ROUTE, REGISTRATION_ROUTE} from '../utils/const';
import MyLink from "../components/UI/link/MyLink";
import {useNavigate} from "react-router-dom";
import {authRoutes} from "../routes";
import {authorization} from "../API/UserService";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Auth = observer(() => {
    const inputs = [
        {label: "Логін", id: "login", name: "login", type: "text", placeholder: "login"},
        {label: "Пароль", id: "password", name: "password", type: "password", placeholder: "password"},

    ];

    const [authData, setAuthData] = useState({
        login: '',
        password: '',
    });

    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user } = useContext(Context);

    const handleRegistrationLinkClick = () => {
        navigate(REGISTRATION_ROUTE);
    }

    const handleAuthChange = (e) => {
        const { name, value } = e.target;
        setAuthData((prevData) => ({
           ...prevData,
            [name]: value
        }));
    };

    const handleAuthBtnClick = async (event) => {
        event.preventDefault()
        try {
            const userData = await authorization(authData.login, authData.password);
            user.setIsAuth(true);
            user.setUser(userData);
            navigate(MAIN_ROUTE);
        } catch (error) {
            if (error.response.status === 400) {
                setError(error.response.data.message);
            }
        }
    }

    return (
        <div className="authContainer">
            <form className="authForm">
                <div className="authHeader">
                    <h2>Авторизація</h2>
                </div>
                <div className="authInputContainer">
                    {inputs.map((input, index) => 
                        <MyInput
                            key={index}
                            label={input.label}
                            id={input.id}
                            type={input.type}
                            name={input.name}
                            placeholder={input.placeholder}
                            onChange={handleAuthChange}
                        />
                    )}
                </div>
                <div className="authLink">
                    <p>Досі не маєте аккаунту?</p>
                    <MyLink
                        linkText=" Зараеєструйтесь!"
                        onClick={handleRegistrationLinkClick}
                    />
                </div>
                <ErrorString
                    errorText={error}
                />
                <div className="authBtn">
                    <Button
                        buttonText="Авторизуватися"
                        onClick={handleAuthBtnClick}
                    />
                </div>
            </form>
        </div>
    );
});

export default Auth;