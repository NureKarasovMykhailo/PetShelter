// AddFeederForm.js

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import { createFeeder } from "../../../API/FeederService";

const AddFeederForm = ({ onSucceedAdd }) => {
    const { t } = useTranslation();

    const inputs = [
        { label: t('capacityLabel'), id: 'capacity', name: 'capacity', type: 'number' },
        { label: t('feederColourLabel'), id: 'feederColour', name: 'feederColour', type: 'text' },
        { label: t('designedForLabel'), id: 'designedFor', name: 'designedFor', type: 'text' },
    ];

    const [errorList, setErrorList] = useState([new ValidationError()]);
    const [data, setData] = useState({
        capacity: '',
        feederColour: '',
        designedFor: '',
    });

    const handleAddFeeder = async (e) => {
        e.preventDefault();
        try {
            await createFeeder(data);
            onSucceedAdd(true);
        } catch (error) {
            if (error.response.status === 400) {
                setErrorList(error.response.data.message);
            }
        }
    };

    return (
        <GeneralForm
            inputs={inputs}
            data={data}
            setData={setData}
            header={t('formHeader')}
            submitButtonText={t('submitButton')}
            errorsList={errorList}
            onClick={handleAddFeeder}
        />
    );
};

export default AddFeederForm;
