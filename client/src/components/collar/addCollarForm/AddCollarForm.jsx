import React, {useState} from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import {createCollar} from "../../../API/CollarService";

const AddCollarForm = ({ setAddSuccess }) => {
    const inputs = [
        {label: 'Мінімальна допустима температура (°C)', name: 'minTemperature', id: 'minTemperature', type: 'number'},
        {label: 'Максимальна допустима температура (°C)', name: 'maxTemperature', id: 'maxTemperature', type: 'number'},
        {label: 'Мінімальний допустимий пульс (удари/хвилина)', name: 'minPulse', id: 'minPulse', type: 'number'},
        {label: 'Максимальний допустимий пульс (удари/хвилина)', name: 'maxPulse', id: 'maxPulse', type: 'number'}
    ];

    const [collarData, setCollarData] = useState({
        minTemperature: '',
        maxTemperature: '',
        minPulse: '',
        maxPulse: '',
    });
    const [errorList, setErrorList] = useState([new ValidationError()]);

    const handleAddCollar = async (e) => {
        e.preventDefault();
        try {
            await createCollar(collarData);
            setAddSuccess(true);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setErrorList(error.response.data.message);
                }
            }
        }
    }


    return (
        <GeneralForm
            inputs={inputs}
            data={collarData}
            setData={setCollarData}
            header={"Додавання нашийника"}
            submitButtonText={"Додати"}
            errorsList={errorList}
            onClick={handleAddCollar}
        />
    );
};

export default AddCollarForm;