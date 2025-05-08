import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Context } from '../../../index';
import GeneralForm from '../../forms/generalForm/GeneralForm';
import ValidationError from '../../../class/ValidationError';
import ErrorString from '../../UI/error/errorString/ErrorString';
import { createEmployee } from '../../../API/EmployeeService';
import { useNavigate } from 'react-router-dom';
import { EMPLOYEES_ROUTE } from '../../../utils/const';

const AddEmployeeForm = observer(({ onSuccess }) => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const inputs = [
        { label: t('loginLabel'), id: 'login', name: 'login', type: 'text', placeholder: 'user' },
        { label: t('domainEmailLabel'), id: 'domainEmail', name: 'domainEmail', type: 'email', placeholder: 'user@domain.ua' },
        { label: t('emailLabel'), id: 'email', name: 'email', type: 'email', placeholder: 'user@gmail.com' },
        { label: t('fullNameLabel'), id: 'fullName', name: 'fullName', type: 'text', placeholder: 'Петренко Петро' },
        { label: t('birthdayLabel'), id: 'birthday', name: 'birthday', type: 'date' },
    ];
    const [employeeData, setEmployeeData] = useState({
        login: '',
        domainEmail: '',
        email: '',
        fullName: '',
        birthday: '',
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
                setErrorList(error.response.data.message);
            }
        }
    };

    return (
        <GeneralForm
            header={t('formHeader')}
            data={employeeData}
            setData={setEmployeeData}
            inputs={inputs}
            submitButtonText={t('submitButton')}
            errorsList={errorList}
            onClick={handleCreateEmployeeClick}
        >
            <ErrorString errorText={errorString} />
        </GeneralForm>
    );
});

export default AddEmployeeForm;
