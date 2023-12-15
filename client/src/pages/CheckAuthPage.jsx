import React, {useContext, useState} from 'react';
import {useLocation, useNavigate, useNavigation} from "react-router-dom";
import GeneralForm from "../components/forms/generalForm/GeneralForm";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import {authorization} from "../API/UserService";
import {CHANGE_EMAIL_ROUTE, CHANGE_PHONE_ROUTE} from "../utils/const";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const CheckAuthPage = observer(() => {
    const inputs = [
        {label: "Пароль", id: "password", name: "password", type: "password", placeholder: "password", value: ''},
    ];
    const [confirmData, setConfirmData] = useState({
        password: '',
    });
    const [error, setError] = useState('');
    const location = useLocation();
    const navigation = useNavigate();
    const { user } = useContext(Context);

    const handleConfirmFormChange = (e) => {
        const {name, value} = e.target;
        setConfirmData(prevValue => ({
            ...prevValue,
            [name]: value
        }));
    }
    const handleConfirmBtnClick = async (event) => {
        event.preventDefault();
        try {
            console.log(user.user.login)
            console.log(confirmData.password)
            await authorization(user.user.login, confirmData.password);
            if (location.state.email) {
                navigation(CHANGE_EMAIL_ROUTE);
            } else if (location.state.phone) {
                navigation(CHANGE_PHONE_ROUTE);
            }

        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <div>
            <GeneralForm
                header="Підтердження"
                inputs={inputs}
                onChange={handleConfirmFormChange}
                onClick={handleConfirmBtnClick}
                submitButtonText="Підтвердити"
                data={confirmData}
            >
                <ErrorString
                    errorText={error}
                />
            </GeneralForm>
        </div>
    );
});

export default CheckAuthPage;