import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GeneralForm from '../components/forms/generalForm/GeneralForm';
import ErrorString from '../components/UI/error/errorString/ErrorString';
import { observer } from 'mobx-react-lite';
import { changePassword, checkConfirmationCode } from '../API/UserService';
import { Context } from '../index';
import '../styles/ChangePassword.css';
import { AUTH_ROUTE, PROFILE_ROUTE } from '../utils/const';

const ChangePasswordPage = observer(() => {
    const { t } = useTranslation();
    const location = useLocation();

    const confirmationCodeInput = [
        {
            label: t('confirmationCodeLabel'),
            id: 'confirmationCode',
            name: 'confirmationCode',
            type: 'number',
            placeholder: '12345678',
        },
    ];

    const changePasswordInputs = [
        { label: t('newPasswordLabel'), id: 'newPassword', name: 'newPassword', type: 'password', placeholder: 'password' },
        { label: t('passwordConfirmLabel'), id: 'passwordConfirm', name: 'passwordConfirm', type: 'password', placeholder: 'password' },
    ];

    const [confirmationCode, setConfirmationCode] = useState({
        confirmationCode: '',
    });

    const [error, setError] = useState('');
    const [passwordInputs, setPasswordInputs] = useState({
        newPassword: '',
        passwordConfirm: '',
    });

    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(Context);

    const handleCheckConfirmationCode = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (location.state.isAuth) {
                response = await checkConfirmationCode(confirmationCode.confirmationCode, user.user.email);
            } else {
                response = await checkConfirmationCode(confirmationCode.confirmationCode, location.state.email);
            }
            if (response.status === 200) {
                setIsChecked(true);
            }
        } catch (error) {
            if (error.response.status === 400) {
                setError(error.response.data.message);
            }
        }
    };

    const handleChangePasswordBtnClick = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (location.state.isAuth) {
                response = await changePassword(user.user.email, passwordInputs.newPassword, passwordInputs.passwordConfirm);
                if (response.status === 200) {
                    navigate(PROFILE_ROUTE);
                }
            } else {
                response = await changePassword(location.state.email, passwordInputs.newPassword, passwordInputs.passwordConfirm);
                if (response.status === 200) {
                    navigate(AUTH_ROUTE);
                }
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="change-password__container">
            <div className={isChecked ? 'change-password__confirm' : 'change-password__confirm.active'}>
                <GeneralForm
                    inputs={confirmationCodeInput}
                    header={t('confirmationHeader')}
                    data={confirmationCode}
                    setData={setConfirmationCode}
                    submitButtonText={t('confirmationSubmitButtonText')}
                    onClick={handleCheckConfirmationCode}
                >
                    <ErrorString errorText={error} />
                </GeneralForm>
            </div>
            <div className={isChecked ? 'change-password__password.active' : 'change-password__password'}>
                <GeneralForm
                    inputs={changePasswordInputs}
                    data={passwordInputs}
                    setData={setPasswordInputs}
                    submitButtonText={t('passwordSubmitButtonText')}
                    header={t('passwordHeader')}
                    onClick={handleChangePasswordBtnClick}
                >
                    <ErrorString errorText={error} />
                </GeneralForm>
            </div>
        </div>
    );
});

export default ChangePasswordPage;
