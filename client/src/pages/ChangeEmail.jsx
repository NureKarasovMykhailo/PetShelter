import React, {useState} from 'react';
import GeneralForm from "../components/forms/generalForm/GeneralForm";
import {changeEmail} from "../API/UserService";
import {useNavigate} from "react-router-dom";
import {PROFILE_ROUTE} from "../utils/const";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import '../styles/ChangeEmail.css';

const ChangeEmail = () => {
    const inputs = [
        {label: 'Введить новий адрес електроної пошти', name: 'newEmail', id: 'newEmail', type: 'email', placeholder: 'email'}
    ];
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangeBtnClick = async (e) => {
        e.preventDefault();
        try {
            console.log(newEmail)
            const response = await changeEmail(newEmail);
            if (response.status === 200) {
                navigate(PROFILE_ROUTE);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <div className="new-email__container">
            <GeneralForm
                header="Зміна електроної пошти"
                inputs={inputs}
                setData={setNewEmail}
                onClick={handleChangeBtnClick}
                submitButtonText="Змінити email"
                data={newEmail}
            >
                <ErrorString
                    errorText={error}
                />
            </GeneralForm>
        </div>
    );
};

export default ChangeEmail;