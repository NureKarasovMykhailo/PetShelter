import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import '../styles/ShelterPage.css';
import {BiCaretUp} from "react-icons/bi";
import Button from "../components/UI/button/Button";
import Modal from "../components/UI/modal/Modal";
import GeneralForm from "../components/forms/generalForm/GeneralForm";
import {createShelter} from "../API/ShelterService";
import ErrorString from "../components/UI/error/errorString/ErrorString";
import {useNavigate} from "react-router-dom";
import {PROFILE_ROUTE} from "../utils/const";
import ImagePreview from "../components/UI/image/ImagePreview";

const ShelterPage = observer(() => {
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
        shelterImage: '',
    });
    const [errorList, setErrorList] = useState([{
        msg: '',
        path: '',
        type: '',
        location: '',
    }]);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();
    const [errorString, setErrorString] = useState('');
    const handleCreateShelterChange = (e) => {

        const { name, type } = e.target;
        const value = type === 'file' ? e.target.files[0] : e.target.value;

        if (type === 'file') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }

        setCreatShelterInfo((prevData) => ({
                ...prevData,
                [name]: value,
        }));
    }

    const handleShelterCreatBtnClick = async (e) => {
        e.preventDefault();
        try {
            await createShelter(createShelterInfo);
            navigate(PROFILE_ROUTE);
        } catch (error) {
            console.log(error);
            if (error.response.status === 400) {
                setErrorList(error.response.data.message)
            } else if (error.response.status === 409) {
                setErrorString(error.response.data.message);
            }
        }
    }

    const { user } = useContext(Context);
    const [addModalActive, setAddModalActive] = useState(false);

    const handleAddShelterBtnClick = () => {
        setAddModalActive(true);
    }

    return (
        <div className="shelter-wrapper">
            {user.user.shelterId
                ?
                <div className="shelter-wrapper__container shelter-container">
                    <div className="shelter-container__header">
                        <h2>Меню притулку</h2>
                    </div>
                    <div className="shelter-container__information">
                        <div className="shelter-container__information-subheader">
                            <h3>Інформація про притулок</h3>
                        </div>
                        <div className="shelter-container__information-row">
                            <div className="shelter-container__information-image">
cd
                            </div>
                            <div className="shelter-container__information-container">
                                
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="shelter-wrapper__container shelter-container">
                    <div className="shelter-container__label">
                        <p>Ви ще не створили меню свого притулку</p>
                    </div>
                    <div className="shelter-container__add-shelter-button">
                        <Button
                            buttonText={"Додати притулок"}
                            onClick={handleAddShelterBtnClick}
                        />
                    </div>
                </div>
            }
            <Modal
                active={addModalActive}
                setActive={setAddModalActive}
            >
                <GeneralForm
                    inputs={addInputs}
                    onChange={handleCreateShelterChange}
                    data={createShelterInfo}
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
            </Modal>
        </div>
    );
});

export default ShelterPage;