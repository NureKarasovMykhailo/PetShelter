import React, {useState} from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import TextArea from "../../UI/input/textArea/TextArea";
import PhoneNumberInput from "../../UI/input/phoneNumberInput/PhoneNumberInput";
import stl from './AddWorkOfferForm.module.css';
import {createWorkOffer} from "../../../API/WorkOfferService";

const AddWorkOfferForm = ({setRefresh}) => {
    const inputs = [
        {label: "Назва роботи", name: "workTitle", id: "workTitle", type: "text"},
        {label: "Контактний email", name: "workEmail", id: "workEmail", type: "email"},
    ];
    const [workOfferData, setWorkOfferData] = useState({
        workTitle: '',
        workEmail: '',
    });
    const [workDescription, setWorkDescription] = useState('');
    const [workTelephone, setWorkTelephone] = useState('');
    const [errorList, setErrorList] = useState([new ValidationError()]);

    const handleCreateWorkOffer = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('workTitle', workOfferData.workTitle);
            formData.append('workEmail', workOfferData.workEmail);
            formData.append('workDescription', workDescription);
            formData.append('workTelephone', workTelephone);

            await createWorkOffer(formData);
            setRefresh(true);
        } catch (error) {
            console.log(error);
            if (error.response ) {
                if (error.response.status === 400) {
                    setErrorList(error.response.data.message);
                }
            }
        }
    }

    return (
        <GeneralForm
            header={"Створення оголошення"}
            inputs={inputs}
            data={workOfferData}
            setData={setWorkOfferData}
            submitButtonText={"Створити"}
            errorsList={errorList}
            onClick={handleCreateWorkOffer}
        >
            <TextArea
                label={"Опис:"}
                text={workDescription}
                setText={setWorkDescription}
            />
            <div className={stl.phone}>
                <PhoneNumberInput
                    label={"Контактний номер телефону: "}
                    value={workTelephone}
                    onChange={setWorkTelephone}
                />
            </div>
        </GeneralForm>
    );
};

export default AddWorkOfferForm;