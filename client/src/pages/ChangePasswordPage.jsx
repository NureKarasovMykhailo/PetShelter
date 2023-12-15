import React, {useContext, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import GeneralForm from "../components/forms/generalForm/GeneralForm";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import {observer} from "mobx-react-lite";
import {changePassword, checkConfirmationCode} from "../API/UserService";
import {Context} from "../index";
import '../styles/ChangePassword.css';
import {AUTH_ROUTE, PROFILE_ROUTE} from "../utils/const";

const ChangePasswordPage = observer(() => {
    const location = useLocation();
    const confirmationCodeInput = [
        {
            label: 'Введить код, відправлений на email',
            id: 'confirmationCode',
            name: 'confirmationCode',
            type: 'number',
            placeholder: '12345678'
        }
    ];
    const changePasswordInputs = [
        {label: 'Новий пароль', id: 'newPassword', name: 'newPassword', type: 'password', placeholder: 'password'},
        {label: 'Підтвердіть пароль', id: 'passwordConfirm', name: 'passwordConfirm', type: 'password', placeholder: 'password'}
    ];
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');
    const [passwordInputs, setPasswordInputs] = useState({
        newPassword: '',
        passwordConfirm: ''
    });
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const {user} = useContext(Context);
    const handleConfirmationInputChange = (e) => {
        const {value} = e.target;
        setConfirmationCode(value);
    }
    const handlePasswordInputsChange = (e) => {
        const {name, value} = e.target;
        setPasswordInputs(prevState => ({
          ...prevState,
          [name]: value
        }));
    }
    const handleCheckConfirmationCode = async (e) => {
        e.preventDefault();
        console.log(location)
        try {
            let response;
            if (location.state.isAuth) {
                response = await checkConfirmationCode(confirmationCode, user.user.email);
            } else {
                response = await checkConfirmationCode(confirmationCode, location.state.email);
            }
            if (response.status === 200) {
                setIsChecked(true);
            }
        } catch (error) {
            if (error.response.status === 400) {
                setError(error.response.data.message)
            }
        }
    }

    const handleChangePasswordBtnClick = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (location.state.isAuth) {
                response = await changePassword(user.user.email, passwordInputs.newPassword, passwordInputs.passwordConfirm);
                if (response.status === 200) {
                    navigate(PROFILE_ROUTE)
                }
            } else {
                response = await changePassword(location.state.email, passwordInputs.newPassword, passwordInputs.passwordConfirm);
                if (response.status === 200) {
                    navigate(AUTH_ROUTE)
                }
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    return (
        <div className="changePassword__container">
            <div
                className={isChecked ? "changePassword__confirm" : "changePassword__confirm.active"}
            >
                <GeneralForm
                    inputs={confirmationCodeInput}
                    onChange={handleConfirmationInputChange}
                    header="Підтвредження"
                    data={confirmationCode}
                    submitButtonText="Відправити"
                    onClick={handleCheckConfirmationCode}
                >
                    <ErrorString
                        errorText={error}
                    />
                </GeneralForm>
            </div>
            <div
                className={isChecked ? "changePassword__password.active" : "changePassword__password"}
            >
                <GeneralForm
                    inputs={changePasswordInputs}
                    onChange={handlePasswordInputsChange}
                    data={passwordInputs}
                    submitButtonText="Підтвердити"
                    header="Змінна паролю"
                    onClick={handleChangePasswordBtnClick}
                >
                    <ErrorString
                        errorText={error}
                    />
                </GeneralForm>
            </div>
        </div>
    );
});

export default ChangePasswordPage;