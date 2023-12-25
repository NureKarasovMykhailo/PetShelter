// AddCollarForm.jsx

import React, { useState } from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import { createCollar } from "../../../API/CollarService";
import { useTranslation } from "react-i18next";

const AddCollarForm = ({ setAddSuccess }) => {
    const { t } = useTranslation();

    const inputs = [
        { label: t("minTemperatureLabel"), name: 'minTemperature', id: 'minTemperature', type: 'number' },
        { label: t("maxTemperatureLabel"), name: 'maxTemperature', id: 'maxTemperature', type: 'number' },
        { label: t("minPulseLabel"), name: 'minPulse', id: 'minPulse', type: 'number' },
        { label: t("maxPulseLabel"), name: 'maxPulse', id: 'maxPulse', type: 'number' }
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
            header={t("addCollarHeader")}
            submitButtonText={t("addCollarButton")}
            errorsList={errorList}
            onClick={handleAddCollar}
        />
    );
};

export default AddCollarForm;
