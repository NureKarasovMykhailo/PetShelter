import React, {useEffect, useState} from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import {PhoneInput} from "react-international-phone";
import PhoneNumberInput from "../../UI/input/phoneNumberInput/PhoneNumberInput";
import stl from './AddAdoptionOffer.module.css';
import TextArea from "../../UI/input/textArea/TextArea";
import Loader from "../../UI/loader/Loader";
import {fetchPets} from "../../../API/PetService";
import SelectInput from "../../UI/input/selectInput/SelectInput";
import {createAdoptionOffer} from "../../../API/AdoptionOfferService";

const AddAdoptionOffer = ({pets, setSuccess}) => {
    const inputs = [
        {label: 'Ціна оформлення', id: 'adoptionPrice', name: 'adoptionPrice', type: 'text'},
        {label: 'Email для зв\'яку', id: 'adoptionEmail', name: 'adoptionEmail', type: 'email'},
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
                submitButtonText={"Створити"}
                header={"Створення оголошення про опекунство"}
                errorsList={errorList}
                onClick={handleCreateOfferClick}
            >
                <div className={stl.adoptionInfo}>
                    <TextArea
                        label={"Додаткова інформація"}
                        text={adoptionInfo}
                        setText={setAdoptionInfo}
                    />
                </div>
                <div className={stl.adoptionTelephone}>
                    <p>Контактний номер телефону:</p>
                    <PhoneNumberInput
                        value={adoptionTelephone}
                        onChange={setAdoptionTelephone}
                    />
                </div>
                <div className={stl.adoptionPet}>
                    <p>ID тварини:</p>
                    <SelectInput
                        options={petsOptions}
                        defaultValue={"ID тварини"}
                        setValue={setAdoptionPet}
                    />
                </div>
            </GeneralForm>
    );
};

export default AddAdoptionOffer;