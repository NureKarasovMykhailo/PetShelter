import React, { useState } from 'react';
import Loader from '../UI/loader/Loader';
import GeneralForm from '../forms/generalForm/GeneralForm';
import ImagePreview from '../UI/image/ImagePreview';
import ErrorString from '../UI/error/errorString/ErrorString';
import Modal from '../UI/modal/Modal';
import { updateShelter } from '../../API/ShelterService';
import { useNavigate } from 'react-router-dom';
import { PROFILE_ROUTE } from '../../utils/const';
import { useTranslation } from 'react-i18next';

const UpdateShelterForm = ({ updateModalActive, setUpdateModalActive, shelter, subscriberDomain }) => {
    const { t } = useTranslation();
    const addressParts = shelter.shelter_address.split(' ');
    const streetAndNumber = addressParts.slice(2).join(' ');
    const lastSpaceIndex = streetAndNumber.lastIndexOf(' ');

    let street;
    let number;

    if (lastSpaceIndex !== -1) {
        street = streetAndNumber.slice(0, lastSpaceIndex);
        number = streetAndNumber.slice(lastSpaceIndex + 1);
    } else {
        street = '';
        number = streetAndNumber;
    }

    const updateInputs = [
        { label: t('shelterName'), type: 'text', id: 'newShelterName', name: 'newShelterName' },
        { label: t('shelterCountry'), type: 'text', id: 'newShelterCountry', name: 'newShelterCountry' },
        { label: t('shelterCity'), type: 'text', id: 'newShelterCity', name: 'newShelterCity' },
        { label: t('shelterStreet'), type: 'text', id: 'newShelterStreet', name: 'newShelterStreet' },
        { label: t('shelterHouse'), type: 'text', id: 'newShelterHouse', name: 'newShelterHouse' },
        { label: t('shelterDomain'), type: 'text', id: 'newShelterDomain', name: 'newShelterDomain' },
        { label: t('shelterImage'), type: 'file', id: 'shelterImage', name: 'shelterImage' },
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [errorString, setErrorString] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();
    const [updateShelterInfo, setUpdateShelterInfo] = useState({
        newShelterName: shelter.shelter_name,
        newShelterCountry: addressParts[0],
        newShelterCity: addressParts[1],
        newShelterStreet: street,
        newShelterHouse: number,
        newShelterDomain: shelter.shelter_domain,
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

    const handleUpdateShelterClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log(updateShelterInfo);
            const response = await updateShelter(updateShelterInfo, shelter.id);
            localStorage.setItem('token', response.data.token);
            navigate(PROFILE_ROUTE);
        } catch (error) {
            console.log(error);
            if (error.response.status === 400) {
                setErrorList(error.response.data.message);
            } else if (error.response.status === 409) {
                setErrorString(error.response.data.message);
            }
            setIsLoading(false);
        }
    };

    return (
        <Modal active={updateModalActive} setActive={setUpdateModalActive}>
            {isLoading ? (
                <Loader />
            ) : (
                <GeneralForm
                    inputs={updateInputs}
                    data={updateShelterInfo}
                    setData={setUpdateShelterInfo}
                    submitButtonText={t('updateShelter')}
                    header={t('updateShelter')}
                    errorsList={errorList}
                    onClick={handleUpdateShelterClick}
                >
                    <ErrorString errorText={errorString} />
                </GeneralForm>
            )}
        </Modal>
    );
};

export default UpdateShelterForm;
