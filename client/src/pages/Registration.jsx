import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const inputs = [
        { label: t("loginLabel"), id: "login", type: "text", name: "login", placeholder: t("loginPlaceholder") },
        { label: t("emailLabel"), id: "email", type: "email", name: "email", placeholder: t("emailPlaceholder") },
        { label: t("fullNameLabel"), id: "fullName", type: "text", name: "fullName", placeholder: t("fullNamePlaceholder") },
        { label: t("birthdayLabel"), id: "birthday", type: "date", name: "birthday" },
        { label: t("phoneNumberLabel"), type: 'phoneNumber', name: 'phoneNumber', id: 'phoneNumber' },
        { label: t("passwordLabel"), id: "password", type: "password", name: "password", placeholder: t("passwordPlaceholder") },
        { label: t("confirmPasswordLabel"), id: "passwordConfirm", type: "password", name: "passwordConfirm", placeholder: t("passwordPlaceholder") },
        { label: t("profileImageLabel"), id: "userImage", type: "file", name: "userImage", placeholder: t("selectImage") }
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
                header={t("registrationHeader")}
                inputs={inputs}
                onClick={signUp}
                submitButtonText={t("registerButton")}
                errorsList={errorList}
                data={userData}
                setData={setUserData}
            >
                <ErrorString
                    errorText={errorString}
                />
                <div className="registration-link-container">
                    <p>{t("haveAccountQuestion")}</p>
                    <MyLink linkText={t("loginLinkText")} onClick={handleAuthLinkClick} />
                </div>
            </GeneralForm>
        </div>
    );
};

export default Registration;
