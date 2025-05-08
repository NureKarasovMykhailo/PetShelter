// AddApplicationForAdoption.jsx

import React, { useState } from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import ErrorString from "../../UI/error/errorString/ErrorString";
import { createApplicationForAdoption } from "../../../API/ApplicationForAdoptionService";
import Button from "../../UI/button/Button";
import stl from './AddApplicationForAdoption.module.css';
import { useNavigate } from "react-router-dom";
import { ADOPTION_OFFER_ROUTE, ALL_ADOPTION_OFFER_ROUTE } from "../../../utils/const";
import { useTranslation } from "react-i18next";

const AddApplicationForAdoption = ({ adoptionOffer }) => {
    const { t } = useTranslation();

    const input = [
        { label: t("residenceAddressLabel"), id: "applicationAddress", name: "applicationAddress", type: "text" },
    ];

    const [applicationData, setApplicationData] = useState({
        applicationAddress: '',
    });
    const [errorList, setErrorList] = useState([new ValidationError()]);
    const [errorString, setErrorString] = useState('');
    const [isCreated, setIsCreated] = useState(false);
    const navigate = useNavigate();

    const handleCreateApplicationForAdoption = async (e) => {
        e.preventDefault();
        try {
            console.log(applicationData.applicationAddress)
            await createApplicationForAdoption(adoptionOffer.id, applicationData.applicationAddress);
            setIsCreated(true);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setErrorList(error.response.data.message);
                } else {
                    setErrorString(error.response.data.message);
                }
            }
        }
    }

    return (
        isCreated
            ?
            <div>
                <p>{t("congratulationsMessage")}</p>
                <div className={stl.applicationForAdoptionButtonContainer}>
                    <div className={stl.applicationForAdoptionNextBtn}>
                        <Button
                            buttonText={t("next")}
                            onClick={() => navigate(ALL_ADOPTION_OFFER_ROUTE)}
                        />
                    </div>
                </div>
            </div>
            :
            <GeneralForm
                inputs={input}
                data={applicationData}
                setData={setApplicationData}
                header={t("applicationFormHeader")}
                submitButtonText={t("submit")}
                errorsList={errorList}
                onClick={handleCreateApplicationForAdoption}
            >
                <ErrorString
                    errorText={errorString}
                />
            </GeneralForm>
    );
};

export default AddApplicationForAdoption;
