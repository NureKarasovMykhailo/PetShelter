import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from '../../../class/ValidationError';
import ErrorString from "../../UI/error/errorString/ErrorString";
import {createEmployee} from "../../../API/EmployeeService";
import {useNavigate} from "react-router-dom";
import {EMPLOYEES_ROUTE} from "../../../utils/const";

const AddEmployeeForm = observer(( { onSuccess } ) => {
    const { user } = useContext(Context);

    const inputs = [
        {label: "Логін", id: "login", name: "login", type: "text", placeholder: "user"},
        {label: "Домений email", id: "domainEmail", name: "domainEmail", type: "email", placeholder: "user@domain.ua"},
        {label: "Email", id: "email", name: "email", type: "email", placeholder: "user@gmail.com"},
        {label: "Прізвище Ім'я", id: "fullName", name: "fullName", type: "text", placeholder: "Петренко Петро"},
        {label: "Дата народження", id: "birthday", name: "birthday", type: "date"},
    ];
    const [employeeData, setEmployeeData] = useState({
        login: '',
        domainEmail: '',
        email: '',
        fullName: '',
        birthday: ''
    });
    const [errorList, setErrorList] = useState([new ValidationError()]);
    const [errorString, setErrorString] = useState('');


    const handleCreateEmployeeClick = async (e) => {
        e.preventDefault();
        try {
            const response = await createEmployee(employeeData);
            onSuccess(true);
        } catch (error) {
            console.log(error);
            if (error.response.status === 409) {
                setErrorString(error.response.data.message);
            } else if (error.response.status === 400) {
                setErrorList(error.response.data.message)
            }
        }
    }

    return (
        <GeneralForm
            header={"Додавання працівника"}
            data={employeeData}
            setData={setEmployeeData}
            inputs={inputs}
            submitButtonText={"Додати працівника"}
            errorsList={errorList}
            onClick={handleCreateEmployeeClick}
        >
            <ErrorString errorText={errorString} />
        </GeneralForm>
    );
});

export default AddEmployeeForm;