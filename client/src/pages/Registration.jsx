import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import MyInput from "../components/UI/input/MyInput";
import FormError from "../components/UI/error/formError/FormError";
import Button from "../components/UI/button/Button";
import MyLink from "../components/UI/link/MyLink";
import ImagePreview from "../components/UI/image/ImagePreview";
import { AUTH_ROUTE } from "../utils/const";
import "../styles/Registration.css";
import { registration } from "../API/UserService";
import ErrorString from "../components/UI/error/errorString/ErrorString";



const Registration = () => {

    const inputs = [
        {label: "Логін", id: "login", type: "text", name: "login", placeholder: "login"},
        {label: "Email", id: "email", type: "email", name: "email", placeholder: "email"},
        {label: "Прізвище Ім'я", id: "fullName", type: "text", name: "fullName", placeholder: "Петренко Петро"},
        {label: "Дата народження", id: "birthday", type: "date", name: "birthday"},
        {label: "Номер телефону", id: "phoneNumber", type: "text", name: "phoneNumber", placeholder: "+380 "},
        {label: "Пароль", id: "password", type: "password", name: "password", placeholder: "password"},
        {label: "Підтвердіть пароль", id: "passwordConfirm", type: "password", name: "passwordConfirm", placeholder: "password"},
        { label: "Зображення профілю", id: "userImage", type: "file", name: "userImage", placeholder: "Вибрати зображення" }
    ];

    const [errorString, setErrorString] = useState("");

    const [imagePreview, setImagePreview] = useState(null);

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
    }])

    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, type } = e.target;
        const value = type === 'file' ? e.target.files[0] : e.target.value;

        if (type === 'file') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }

        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleAuthLinkClick = () => {
        navigate(AUTH_ROUTE);
    }


    const signUp = async (event) => {
        event.preventDefault()
        try {
            const response = await registration(userData);
            console.log(response);
            if (response.status === 200){
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
        <div className="registrationContainer">
            <form encType="multipart/form-data" className="registrationForm">
                <div className="authHeader">
                    <h2>Реєстрація</h2>
                </div>
                <div className="registrationInputsContainer">
                    {inputs.map((input, index) =>
                        <div key={index}>
                            {input.type !== 'file' ?
                                <MyInput
                                    label={input.label}
                                    id={input.id}
                                    type={input.type}
                                    name={input.name}
                                    placeholder={input.placeholder}
                                    onChange={handleChange}
                                    value={userData[input.name]}
                                />
                                :
                                <MyInput
                                    label={input.label}
                                    id={input.id}
                                    type={input.type}
                                    name={input.name}
                                    placeholder={input.placeholder}
                                    onChange={handleChange}
                                />
                            }
                            {<FormError errors={errorList.filter(error => error.path === input.name)} />}
                        </div>
                    )}
                    <ImagePreview
                        imagePreview={imagePreview}
                        alt='User image'
                    />
                </div>
                <ErrorString
                    errorText={errorString}
                />
                <div className="registrationLinkContainer">
                    <p>Маєте аккаунт? </p>
                    <MyLink linkText="Авторизуйтесь!" onClick={handleAuthLinkClick} />
                </div>
                <div className="registerBtnContainer">
                    <Button
                        buttonText="Зареєструватися"
                        onClick={signUp}
                    />
                </div>
            </form>
        </div>
    );
};

export default Registration;