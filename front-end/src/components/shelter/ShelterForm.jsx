import React, {useState, useTransition} from 'react';
import GeneralForm from '../forms/generalForm/GeneralForm';
import ImagePreview from '../UI/image/ImagePreview';
import ErrorString from '../UI/error/errorString/ErrorString';
import Modal from '../UI/modal/Modal';
import { createShelter } from '../../API/ShelterService';
import { PROFILE_ROUTE } from '../../utils/const';
import { useNavigate } from 'react-router-dom';
import Loader from '../UI/loader/Loader';
import {useTranslation} from "react-i18next";

const ShelterForm = ({ addModalActive, setAddModalActive, isUpdate }) => {
    const {t} = useTranslation();
    const addInputs = [
        { label: t('shelterName'), type: 'text', id: 'shelterName', name: 'shelterName' },
        { label: t('shelterCountry'), type: 'text', id: 'shelterCountry', name: 'shelterCountry' },
        { label: t('shelterCity'), type: 'text', id: 'shelterCity', name: 'shelterCity' },
        { label: t('shelterStreet'), type: 'text', id: 'shelterStreet', name: 'shelterStreet' },
        { label: t('shelterHouse'), type: 'text', id: 'shelterHouse', name: 'shelterHouse' },
        { label: t('shelterDomain'), type: 'text', id: 'shelterDomain', name: 'shelterDomain' },
        { label: t('subscriberDomainEmail'), type: 'text', id: 'subscriberDomainEmail', name: 'subscriberDomainEmail' },
        { label: t('shelterImage'), type: 'file', id: 'shelterImage', name: 'shelterImage' },
    ];

    const [createShelterInfo, setCreateShelterInfo] = useState({
        shelterName: '',
        shelterCountry: '',
        shelterCity: '',
        shelterStreet: '',
        shelterHouse: '',
        shelterDomain: '',
        subscriberDomainEmail: '',
        shelterImage: null,
    });

    const [errorList, setErrorList] = useState([
        {
            msg: '',
            path: '',
            type: '',
            location: '',
        },
    ]);

    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorString, setErrorString] = useState('');
    const navigate = useNavigate();

    const handleShelterCreateBtnClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await createShelter(createShelterInfo);
            localStorage.setItem('token', response.data.token);
            navigate(PROFILE_ROUTE);
        } catch (error) {
            console.log(error);
            if (error.response.status === 400) {
                setErrorList(error.response.data.message);
            } else if (error.response.status === 409) {
                setErrorString(error.response.data.message);
            } else if (error.response.status === 403) {
                setErrorString('subscriptionError');
            }
            setIsLoading(false);
        }
    };

    return (
        <Modal active={addModalActive} setActive={setAddModalActive}>
            {isLoading ? (
                <Loader />
            ) : (
                <GeneralForm
                    inputs={addInputs}
                    data={createShelterInfo}
                    setData={setCreateShelterInfo}
                    submitButtonText={t("createShelter")}
                    header="createShelterHeader"
                    onClick={handleShelterCreateBtnClick}
                    errorsList={errorList}
                >
                    <ImagePreview imagePreview={imagePreview} alt="userImageAlt" />
                    <ErrorString errorText={errorString} />
                </GeneralForm>
            )}
        </Modal>
    );
};

export default ShelterForm;



