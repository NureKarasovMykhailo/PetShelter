import React, {useState} from 'react';
import GeneralForm from "../components/forms/generalForm/GeneralForm";
import '../styles/EnterEmail.css';
import {$authHost} from "../API/axiosConfig";
import {sendConfirmationCode} from "../API/UserService";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import {useNavigate} from "react-router-dom";
import {CHANGE_PASSWORD_PAGE} from "../utils/const";

const EnterEmailPage = () => {
    const inputs = [
        {label: 'Введить свій email', type: 'email', placeholder: "email@email.com", id: 'email', name: 'email'}
    ];
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const onInputChange = (e) => {
        const { value } = e.target;
        setEmail(value);
    }
    const onClick = async (e) => {
        e.preventDefault();
        try {
            const response = await sendConfirmationCode(email);
            if (response.status === 200) {
                const state = { email: email }
                navigate(CHANGE_PASSWORD_PAGE, { state });
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    return (
        <div className="email__container">
            <GeneralForm
                header="Змінна паролю"
                inputs={inputs}
                onChange={onInputChange}
                data={email}
                onClick={onClick}
                submitButtonText="Відправити"
            >
                <ErrorString
                    errorText={error}
                />
            </GeneralForm>
        </div>
    );
};

export default EnterEmailPage;