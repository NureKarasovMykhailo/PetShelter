import React, {useState} from 'react';
import GeneralForm from "../forms/generalForm/GeneralForm";
import ImagePreview from "../UI/image/ImagePreview";
import ErrorString from "../UI/error/errorString/ErrorString";
import Modal from "../UI/modal/Modal";
import {createShelter} from "../../API/ShelterService";
import {PROFILE_ROUTE, SHELTER_ROUTE} from "../../utils/const";
import {useNavigate} from "react-router-dom";
import Loader from "../UI/loader/Loader";

const ShelterForm = ({addModalActive, setAddModalActive, isUpdate}) => {
    const addInputs = [
        {label: 'Назва притулку', type: 'text', id: 'shelterName', name: 'shelterName'},
        {label: 'Країна', type: 'text', id: 'shelterCountry', name: 'shelterCountry'},
        {label: 'Місто', type: 'text', id: 'shelterCity', name: 'shelterCity'},
        {label: 'Вулиця', type: 'text', id: 'shelterStreet', name: 'shelterStreet'},
        {label: 'Номер будинку', type: 'text', id: 'shelterHouse', name: 'shelterHouse'},
        {label: 'Домений адрес', type: 'text', id: 'shelterDomain', name: 'shelterDomain'},
        {label: 'Корпоративний адрес', type: 'text', id: 'subscriberDomainEmail', name: 'subscriberDomainEmail'},
        {label: 'Логотип притулку', type: 'file', id: 'shelterImage', name: 'shelterImage'},
    ];
    const [createShelterInfo, setCreatShelterInfo] = useState({
        shelterName: '',
        shelterCountry: '',
        shelterCity: '',
        shelterStreet: '',
        shelterHouse: '',
        shelterDomain: '',
        subscriberDomainEmail: '',
        shelterImage: null,
    });
    const [errorList, setErrorList] = useState([{
        msg: '',
        path: '',
        type: '',
        location: '',
    }]);


    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorString, setErrorString] = useState('');
    const navigate = useNavigate()

    const handleShelterCreatBtnClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await createShelter(createShelterInfo);
            localStorage.setItem('token', response.data.token);
            navigate(PROFILE_ROUTE)
        } catch (error) {
            console.log(error);
            if (error.response.status === 400) {
                setErrorList(error.response.data.message)
            } else if (error.response.status === 409) {
                setErrorString(error.response.data.message);
            }
            setIsLoading(false);
        }
    }

    return (
        <Modal
            active={addModalActive}
            setActive={setAddModalActive}
        >
            {isLoading ?
                <Loader />
                :
                <GeneralForm
                    inputs={addInputs}
                    data={createShelterInfo}
                    setData={setCreatShelterInfo}
                    submitButtonText="Створити притулок"
                    header={"Стоворення притулку"}
                    onClick={handleShelterCreatBtnClick}
                    errorsList={errorList}
                >
                    <ImagePreview
                        imagePreview={imagePreview}
                        alt='User image'
                    />
                    <ErrorString errorText={errorString}/>
                </GeneralForm>
            }
        </Modal>
    );
};

export default ShelterForm;