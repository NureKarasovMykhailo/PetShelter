import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Button from "../components/UI/button/Button";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import { changePhone } from "../API/UserService";
import { useNavigate } from "react-router-dom";
import { PROFILE_ROUTE } from "../utils/const";
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const ChangePhonePage = () => {
    const { t } = useTranslation(); // Initialize the useTranslation hook
    const [newPhone, setNewPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangeBtnClick = async (e) => {
        e.preventDefault();
        try {
            const response = await changePhone(newPhone);
            if (response.status === 200) {
                navigate(PROFILE_ROUTE);
            }
        } catch (error) {
            setError(t('serverError'));
        }
    }

    return (
        <div className="change-phone__container">
            <form className="change-phone__form">
                <h2>{t('phoneFormHeader')}</h2>
                <div className="change-phone__input">
                    <p>{t('inputLabel')}</p>
                    <PhoneInput
                        inputStyle={{ width: '100%', fontSize: 20, padding: 5 }}
                        defaultCountry="ua"
                        value={newPhone}
                        onChange={(newPhone) => setNewPhone(newPhone)}
                    />
                    <div className="change-phone__error">
                        <ErrorString
                            errorText={error}
                        />
                    </div>
                </div>
                <div className="change-phone__button">
                    <Button
                        buttonText={t('buttonText')}
                        onClick={handleChangeBtnClick}
                    />
                </div>
            </form>
        </div>
    );
};

export default ChangePhonePage;
