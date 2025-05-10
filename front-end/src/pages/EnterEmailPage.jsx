import React, { useState } from 'react';
import GeneralForm from "../components/forms/generalForm/GeneralForm";
import '../styles/EnterEmail.css';
import { sendConfirmationCode } from "../API/UserService";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import { useNavigate } from "react-router-dom";
import { CHANGE_PASSWORD_PAGE } from "../utils/const";
import { useTranslation } from 'react-i18next';

const EnterEmailPage = () => {
    const { t } = useTranslation(); // Initialize the useTranslation hook

    const inputs = [
        { label: t('emailInputLabel'), type: 'email', placeholder: t('emailInputPlaceholder'), id: 'email', name: 'email' }
    ];

    const [email, setEmail] = useState({
        email: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onClick = async (e) => {
        e.preventDefault();
        try {
            const response = await sendConfirmationCode(email.email);
            if (response.status === 200) {
                const state = { email: email.email }
                navigate(CHANGE_PASSWORD_PAGE, { state });
            }
        } catch (error) {
            setError(t('errorMessage'));
        }
    }

    return (
        <div className="email__container">
            <GeneralForm
                header={t('enterEmailHeader')}
                inputs={inputs}
                setData={setEmail}
                data={email}
                onClick={onClick}
                submitButtonText={t('submitButton')}
            >
                <ErrorString
                    errorText={error}
                />
            </GeneralForm>
        </div>
    );
};

export default EnterEmailPage;
