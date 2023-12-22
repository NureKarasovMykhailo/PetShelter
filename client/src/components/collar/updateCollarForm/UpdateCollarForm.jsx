import React, {useState} from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import {updateCollar} from "../../../API/CollarService";

const UpdateCollarForm = ({ collar, setOnSuccess }) => {
    const inputs = [
        {label: 'Мінімальна допустима температура (°C)', name: 'newMinTemperature', id: 'newMinTemperature', type: 'number'},
        {label: 'Максимальна допустима температура (°C)', name: 'newMaxTemperature', id: 'newMaxTemperature', type: 'number'},
        {label: 'Мінімальний допустимий пульс (удари/хвилина)', name: 'newMinPulse', id: 'newMinPulse', type: 'number'},
        {label: 'Максимальний допустимий пульс (удари/хвилина)', name: 'newMaxPulse', id: 'newMaxPulse', type: 'number'}
    ];
    const [newCollarData, setNewCollarData] = useState({
       newMinTemperature: collar.min_temperature,
       newMaxTemperature: collar.max_temperature,
       newMinPulse: collar.min_pulse,
       newMaxPulse: collar.max_pulse
    });
    const [errorList, setErrorList] = useState([new ValidationError()]);

    const handleUpdateCollar = async (e) => {
        e.preventDefault();
        try {
            await updateCollar(newCollarData, collar.id);
            setOnSuccess(true);
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
            header={"Оновлення нашийника"}
            inputs={inputs}
            data={newCollarData}
            setData={setNewCollarData}
            errorsList={errorList}
            submitButtonText={"Оновити"}
            onClick={handleUpdateCollar}
        />
    );
};

export default UpdateCollarForm;