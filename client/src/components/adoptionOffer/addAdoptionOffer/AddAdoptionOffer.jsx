// AddAdoptionOffer.jsx

import React, { useEffect, useState } from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import { PhoneInput } from "react-international-phone";
import PhoneNumberInput from "../../UI/input/phoneNumberInput/PhoneNumberInput";
import stl from './AddAdoptionOffer.module.css';
import TextArea from "../../UI/input/textArea/TextArea";
import Loader from "../../UI/loader/Loader";
import { fetchPets } from "../../../API/PetService";
import SelectInput from "../../UI/input/selectInput/SelectInput";
import { createAdoptionOffer } from "../../../API/AdoptionOfferService";
import { useTranslation } from "react-i18next";

const AddAdoptionOffer = ({ pets, setSuccess }) => {
    const { t } = useTranslation();

    const inputs = [
        { label: t('adoptionPriceLabel'), id: 'adoptionPrice', name: 'adoptionPrice', type: 'text' },
        { label: t('adoptionEmailLabel'), id: 'adoptionEmail', name: 'adoptionEmail', type: 'email' },
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [petsOptions, setPetsOptions] = useState([{}]);
    const [adoptionOfferData, setAdoptionOfferData] = useState({
        adoptionPrice: '',
        adoptionEmail: '',
    });
    const [adoptionTelephone, setAdoptionTelephone] = useState('');
    const [adoptionInfo, setAdoptionInfo] = useState('');
    const [adoptionPet, setAdoptionPet] = useState('');
    const [errorList, setErrorList] = useState([new ValidationError()]);

    const handleCreateOfferClick = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append('adoptionPrice', adoptionOfferData.adoptionPrice);
            formData.append('adoptionEmail', adoptionOfferData.adoptionEmail);
            formData.append('adoptionTelephone', adoptionTelephone);
            formData.append('adoptionInfo', adoptionInfo);

            await createAdoptionOffer(formData, adoptionPet);
            setSuccess(true);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setErrorList(error.response.data.message);
                }
            }
        }
    }

    useEffect(() => {
        setIsLoading(true);
        const uniquePets = [...new Set(pets)].filter(Boolean);
        const options = uniquePets.map(pet => ({ value: pet.id, name: pet.id }));
        setPetsOptions(options);
        setIsLoading(false);
    }, []);


    return (
        isLoading
            ?
            <Loader />
            :
            <GeneralForm
                inputs={inputs}
                data={adoptionOfferData}
                setData={setAdoptionOfferData}
                submitButtonText={t("create")}
                header={t("adoptionOfferCreationHeader")}
                errorsList={errorList}
                onClick={handleCreateOfferClick}
            >
                <div className={stl.adoptionInfo}>
                    <TextArea
                        label={t("additionalInformationLabel")}
                        text={adoptionInfo}
                        setText={setAdoptionInfo}
                    />
                </div>
                <div className={stl.adoptionTelephone}>
                    <p>{t("contactPhoneNumberLabel")}:</p>
                    <PhoneNumberInput
                        value={adoptionTelephone}
                        onChange={setAdoptionTelephone}
                    />
                </div>
                <div className={stl.adoptionPet}>
                    <p>{t("petIdLabel")}:</p>
                    <SelectInput
                        options={petsOptions}
                        defaultValue={t("petIdPlaceholder")}
                        setValue={setAdoptionPet}
                    />
                </div>
            </GeneralForm>
    );
};

export default AddAdoptionOffer;
