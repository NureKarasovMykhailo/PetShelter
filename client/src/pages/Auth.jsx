import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ENTER_EMAIL_PAGE, MAIN_ROUTE, REGISTRATION_ROUTE } from '../utils/const';
import MyLink from '../components/UI/link/MyLink';
import { authorization } from '../API/UserService';
import ErrorString from '../components/UI/error/errorString/ErrorString';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import GeneralForm from '../components/forms/generalForm/GeneralForm';
import PasswordInput from '../components/UI/input/passwordInput/PasswordInput';

const Auth = observer(() => {
    const { t } = useTranslation();
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const inputs = [
        { label: t('labelLogin'), id: 'login', name: 'login', type: 'text', placeholder: t('placeholderLogin') },
        { label: t('labelPassword'), id: 'password', name: 'password', type: 'password', placeholder: t('placeholderPassword') },
    ];

    const [authData, setAuthData] = useState({
        login: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleAuthBtnClick = async (event) => {
        event.preventDefault();
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
    };

    return (
        <div className="auth-container">
            <GeneralForm
                header={t('formHeader')}
                inputs={inputs}
                onClick={handleAuthBtnClick}
                submitButtonText={t('submitButtonText')}
                data={authData}
                setData={setAuthData}
            >
                <div className="auth__children">
                    <div className="auth-link">
                        <p>{t('notHaveAccount')}</p>
                        <MyLink linkText={` ${t('registerNow')} `} onClick={() => navigate(REGISTRATION_ROUTE)} />
                    </div>
                    <MyLink linkText={t('forgotPassword')} onClick={() => navigate(ENTER_EMAIL_PAGE)} />
                    <ErrorString errorText={error} />
                </div>
            </GeneralForm>
        </div>
    );
});

export default Auth;

