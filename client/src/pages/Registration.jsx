import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyLink from "../components/UI/link/MyLink";
import ImagePreview from "../components/UI/image/ImagePreview";
import { AUTH_ROUTE } from "../utils/const";
import "../styles/Registration.css";
import { registration } from "../API/UserService";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import GeneralForm from "../components/forms/generalForm/GeneralForm";
import { PhoneInput } from "react-international-phone";
import PasswordInput from "../components/UI/input/passwordInput/PasswordInput";

const Registration = () => {
    const inputs = [
        { label: "Логін", id: "login", type: "text", name: "login", placeholder: "login" },
        { label: "Email", id: "email", type: "email", name: "email", placeholder: "email" },
        { label: "Прізвище Ім'я", id: "fullName", type: "text", name: "fullName", placeholder: "Петренко Петро" },
        { label: "Дата народження", id: "birthday", type: "date", name: "birthday" },
        { label: "Номер телефона", type: 'phoneNumber', name: 'phoneNumber', id: 'phoneNumber' },
        { label: "Пароль", id: "password", type: "password", name: "password", placeholder: "password" },
        { label: "Підтвердіть пароль", id: "passwordConfirm", type: "password", name: "passwordConfirm", placeholder: "password" },
        { label: "Зображення профілю", id: "userImage", type: "file", name: "userImage", placeholder: "Вибрати зображення" }
    ];

    const [errorString, setErrorString] = useState("");

    const [userData, setUserData] = useState({
        login: '',
        email: '',
        fullName: '',
        birthday: '',
        phoneNumber: '',
        password: '',
        passwordConfirm: '',
        userImage: null,
    });

    const [errorList, setErrorList] = useState([{
        msg: '',
        path: '',
        type: '',
        location: '',
    }]);

    const navigate = useNavigate();

    const handleAuthLinkClick = () => {
        navigate(AUTH_ROUTE);
    }

    const signUp = async (event) => {
        event.preventDefault()
        try {
            const response = await registration(userData);
            console.log(response);
            if (response.status === 200) {
                navigate(AUTH_ROUTE);
            }
        } catch (error) {
            console.error(error);
            if (error.response.status === 409) {
                setErrorString(error.response.data.message)
                console.log(error.response.data.message);
            } else if (error.response.status === 400) {
                setErrorList(error.response.data.message);
            }
        }
    }

    return (
        <div className="registration-container">
            <GeneralForm
                header="Реєстрація"
                inputs={inputs}
                onClick={signUp}
                submitButtonText="Зареєструватися"
                errorsList={errorList}
                data={userData}
                setData={setUserData}
            >
                <ErrorString
                    errorText={errorString}
                />
                <div className="registration-link-container">
                    <p>Маєте аккаунт? </p>
                    <MyLink linkText="Авторизуйтесь!" onClick={handleAuthLinkClick} />
                </div>
            </GeneralForm>
        </div>
    );
};

export default Registration;
