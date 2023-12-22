import React, {useState} from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import Button from "../../UI/button/Button";
import stl from './addPetForm.module.css';
import AddFeature from "../addFeature/AddFeature";
import {addPet} from "../../../API/PetService";
import ValidationError from "../../../class/ValidationError";

const AddPetForm = ({ onAddSuccess }) => {
    const inputs = [
        {label: 'Кличка тварини', name: 'petName', id: 'petName', placeholder: 'Мурзік', type: 'text'},
        {label: 'Вік', name: 'petAge', id: 'petAge', type: 'number'},
        {label: 'Стать', name: 'petGender', id: 'petGender', type: 'text'},
        {label: 'Кліка', name: 'cellNumber', id: 'cellNumber', type: 'text', placeholder: '54F'},
        {label: 'Фото', name: 'petImage', id: 'petImage', type: 'file'},
        {label: 'Вид', name: 'petKind', id: 'petKind', type: 'text', placeholder: 'Кішка'}
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
        info: info
    });

    const addInfo = (e) => {
        e.preventDefault();
        setInfo([...info, {title: '', description: '', number: Date.now()}])
    }

    const handleAddPet = async (e) => {
        e.preventDefault()
        try {
            const response = await addPet(petData);
            onAddSuccess(true);
        } catch (error) {
            if (error.response.status === 400) {
                console.log(error)
                setErrorList(error.response.data.message);
            }
        }
    }

    const isDisabled = petData.petImage === null;

    return (
        <div>
            <GeneralForm
                inputs={inputs}
                data={petData}
                setData={setPetData}
                submitButtonText={"Додати"}
                header={"Додавання тварини"}
                onClick={handleAddPet}
                isDisabled={isDisabled}
                errorsList={errorList}
            >
                <hr />
                <div className={stl.addFeatureContainer}>
                    <div className={stl.addFeatureBtn}>
                        <Button
                            buttonText={"Додати характеристику"}
                            onClick={addInfo}
                        />
                    </div>
                    {
                        info.map(i =>
                            <AddFeature
                                key={i.number}
                                info={i}
                                data={info}
                                setData={setInfo}
                                petData={petData}
                                setPetData={setPetData}
                            />
                        )
                    }
                </div>
            </GeneralForm>
        </div>
    );
};

export default AddPetForm;