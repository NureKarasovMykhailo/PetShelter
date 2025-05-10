import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GeneralForm from '../../forms/generalForm/GeneralForm';
import Button from '../../UI/button/Button';
import stl from './addPetForm.module.css';
import AddFeature from '../addFeature/AddFeature';
import { addPet } from '../../../API/PetService';
import ValidationError from '../../../class/ValidationError';

const AddPetForm = ({ onAddSuccess }) => {
    const { t } = useTranslation();

    const inputs = [
        { label: t('petName'), name: 'petName', id: 'petName', placeholder: t('petName'), type: 'text' },
        { label: t('age'), name: 'petAge', id: 'petAge', type: 'number' },
        { label: t('gender'), name: 'petGender', id: 'petGender', type: 'text' },
        { label: t('cellNumber'), name: 'cellNumber', id: 'cellNumber', type: 'text', placeholder: '54F' },
        { label: t('photo'), name: 'petImage', id: 'petImage', type: 'file' },
        { label: t('kind'), name: 'petKind', id: 'petKind', type: 'text', placeholder: t('kind') },
    ];

    const [info, setInfo] = useState([]);
    const [errorList, setErrorList] = useState([new ValidationError()]);

    const [petData, setPetData] = useState({
        petName: '',
        petAge: '',
        petGender: '',
        cellNumber: '',
        petImage: null,
        petKind: '',
        info: info,
    });

    const addInfo = (e) => {
        e.preventDefault();
        setInfo([...info, { title: '', description: '', number: Date.now() }]);
    };

    const handleAddPet = async (e) => {
        e.preventDefault();
        try {
            const response = await addPet(petData);
            onAddSuccess(true);
        } catch (error) {
            if (error.response.status === 400) {
                console.log(error);
                setErrorList(error.response.data.message);
            }
        }
    };

    const isDisabled = petData.petImage === null;

    return (
        <div>
            <GeneralForm
                inputs={inputs}
                data={petData}
                setData={setPetData}
                submitButtonText={t('addPet')}
                header={t('addPet')}
                onClick={handleAddPet}
                isDisabled={isDisabled}
                errorsList={errorList}
            >
                <hr />
                <div className={stl.addFeatureContainer}>
                    <div className={stl.addFeatureBtn}>
                        <Button buttonText={t('addFeature')} onClick={addInfo} />
                    </div>
                    {info.map((i) => (
                        <AddFeature
                            key={i.number}
                            info={i}
                            data={info}
                            setData={setInfo}
                            petData={petData}
                            setPetData={setPetData}
                        />
                    ))}
                </div>
            </GeneralForm>
        </div>
    );
};

export default AddPetForm;
