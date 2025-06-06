// AdoptionOfferUpdate.jsx

import React, { useState } from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import TextArea from "../../UI/input/textArea/TextArea";
import PhoneNumberInput from "../../UI/input/phoneNumberInput/PhoneNumberInput";
import stl from './AdoptionOfferUpdate.module.css';
import { updateAdoptionOffer } from "../../../API/AdoptionOfferService";
import { useTranslation } from "react-i18next";

const AdoptionOfferUpdate = ({ adoptionOffer, setRefresh }) => {
    const { t } = useTranslation();

    const inputs = [
        { label: t('adoptionPriceLabel'), id: 'adoptionPrice', name: 'adoptionPrice', type: 'text' },
        { label: t('adoptionEmailLabel'), id: 'adoptionEmail', name: 'adoptionEmail', type: 'email' },
    ];

    const [adoptionOfferData, setAdoptionOfferData] = useState({
        adoptionPrice: adoptionOffer.adoption_price,
        adoptionEmail: adoptionOffer.adoption_email,
    });
    const [adoptionTelephone, setAdoptionTelephone] = useState(adoptionOffer.adoption_telephone);
    const [adoptionInfo, setAdoptionInfo] = useState(adoptionOffer.adoption_info);
    const [errorList, setErrorList] = useState([new ValidationError()]);

    const handleUpdateAdoptionOffer = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('adoptionPrice', adoptionOfferData.adoptionPrice);
            formData.append('adoptionEmail', adoptionOfferData.adoptionEmail);
            formData.append('adoptionTelephone', adoptionTelephone);
            formData.append('adoptionInfo', adoptionInfo);
            await updateAdoptionOffer(adoptionOffer.id, formData);
            setRefresh(true);
        } catch (error) {
            console.log(error);
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
            data={adoptionOfferData}
            setData={setAdoptionOfferData}
            submitButtonText={t("accept")}
            header={t("adoptionOfferUpdateHeader")}
            errorsList={errorList}
            onClick={handleUpdateAdoptionOffer}
        >
            <div className={stl.adoptionInfo}>
                <TextArea
                    label={t("additionalInformationLabel")}
                    text={adoptionInfo}
                    setText={setAdoptionInfo}
                />
            </div>
            <div className={stl.adoptionTelephone}>
                <PhoneNumberInput
                    label={t("contactPhoneNumberLabel")}
                    value={adoptionTelephone}
                    onChange={setAdoptionTelephone}
                />
            </div>
        </GeneralForm>
    );
};

export default AdoptionOfferUpdate;
