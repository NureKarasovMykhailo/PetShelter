import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GeneralForm from '../components/forms/generalForm/GeneralForm';
import ErrorString from '../components/UI/error/errorString/ErrorString';
import { authorization } from '../API/UserService';
import { CHANGE_EMAIL_ROUTE, CHANGE_PHONE_ROUTE } from '../utils/const';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const CheckAuthPage = observer(() => {
    const { t } = useTranslation(); // Initialize the useTranslation hook
    const inputs = [
        { label: t('passwordLabel'), id: 'password', name: 'password', type: 'password', placeholder: t('passwordPlaceholder'), value: '' },
    ];
    const [confirmData, setConfirmData] = useState({
        password: '',
    });
    const [error, setError] = useState('');
    const location = useLocation();
    const navigation = useNavigate();
    const { user } = useContext(Context);

    const handleConfirmBtnClick = async (event) => {
        event.preventDefault();
        try {
            console.log(user.user.login);
            console.log(confirmData.password);
            await authorization(user.user.login, confirmData.password);
            if (location.state.email) {
                navigation(CHANGE_EMAIL_ROUTE);
            } else if (location.state.phone) {
                navigation(CHANGE_PHONE_ROUTE);
            }
        } catch (error) {
            setError(t('serverError'));
        }
    };

    return (
        <div>
            <GeneralForm
                header={t('confirmHeader')}
                inputs={inputs}
                onClick={handleConfirmBtnClick}
                submitButtonText={t('confirmButtonText')}
                data={confirmData}
                setData={setConfirmData}
            >
                <ErrorString errorText={error} />
            </GeneralForm>
        </div>
    );
});

export default CheckAuthPage;
