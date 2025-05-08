// UpdateCollarForm.jsx

import React, { useState } from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import { updateCollar } from "../../../API/CollarService";
import { useTranslation } from "react-i18next";

const UpdateCollarForm = ({ collar, setOnSuccess }) => {
    const { t } = useTranslation();
    const inputs = [
        { label: t("minTemperatureLabel"), name: 'newMinTemperature', id: 'newMinTemperature', type: 'number' },
        { label: t("maxTemperatureLabel"), name: 'newMaxTemperature', id: 'newMaxTemperature', type: 'number' },
        { label: t("minPulseLabel"), name: 'newMinPulse', id: 'newMinPulse', type: 'number' },
        { label: t("maxPulseLabel"), name: 'newMaxPulse', id: 'newMaxPulse', type: 'number' }
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
            header={t("collarUpdateHeader")}
            inputs={inputs}
            data={newCollarData}
            setData={setNewCollarData}
            errorsList={errorList}
            submitButtonText={t("updateButton")}
            onClick={handleUpdateCollar}
        />
    );
};

export default UpdateCollarForm;
