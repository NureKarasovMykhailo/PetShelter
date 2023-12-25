import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GeneralForm from '../components/forms/generalForm/GeneralForm';
import { changeEmail } from '../API/UserService';
import { PROFILE_ROUTE } from '../utils/const';
import ErrorString from '../components/UI/error/errorString/ErrorString';
import '../styles/ChangeEmail.css';

const ChangeEmail = () => {
    const { t } = useTranslation();
    const inputs = [
        { label: t('labelNewEmail'), name: 'newEmail', id: 'newEmail', type: 'email', placeholder: t('placeholderEmail') },
    ];
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangeBtnClick = async (e) => {
        e.preventDefault();
        try {
            console.log(newEmail);
            const response = await changeEmail(newEmail);
            if (response.status === 200) {
                navigate(PROFILE_ROUTE);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="new-email__container">
            <GeneralForm
                header={t('emailformHeader')}
                inputs={inputs}
                setData={setNewEmail}
                onClick={handleChangeBtnClick}
                submitButtonText={t('emailSubmitButtonText')}
                data={newEmail}
            >
                <ErrorString errorText={error} />
            </GeneralForm>
        </div>
    );
};

export default ChangeEmail;
