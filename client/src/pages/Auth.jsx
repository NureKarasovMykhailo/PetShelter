import React, {useContext, useState} from 'react';
import "../styles/Auth.css";
import {ENTER_EMAIL_PAGE, MAIN_ROUTE, REGISTRATION_ROUTE} from '../utils/const';
import MyLink from "../components/UI/link/MyLink";
import {useNavigate} from "react-router-dom";
import {authorization} from "../API/UserService";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import GeneralForm from "../components/forms/generalForm/GeneralForm";
import PasswordInput from "../components/UI/input/passwordInput/PasswordInput";

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

    const handleForgotPasswordClick = () => {
        navigate(ENTER_EMAIL_PAGE);
    }

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
            <GeneralForm
                header="Авторизація"
                inputs={inputs}
                onChange={handleAuthChange}
                onClick={handleAuthBtnClick}
                submitButtonText="Авторизація"
                data={authData}
            >
               <div className="auth__children">
                   <div className="authLink">
                       <p>Досі не маєте аккаунту?</p>
                       <MyLink
                           linkText="&nbsp;Зараеєструйтесь!"
                           onClick={handleRegistrationLinkClick}
                       />
                   </div>
                   <MyLink
                       linkText="Забули пароль?"
                       onClick={handleForgotPasswordClick}
                   />
                   <ErrorString
                       errorText={error}
                   />
               </div>
            </GeneralForm>
        </div>
    );
});

export default Auth;