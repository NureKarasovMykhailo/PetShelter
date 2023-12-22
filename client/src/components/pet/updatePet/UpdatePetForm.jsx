import React, {useEffect, useState} from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import Button from "../../UI/button/Button";
import stl from "./UpdatePetForm.module.css";
import MyInput from "../../UI/input/MyInput/MyInput";
import DeleteButton from "../../UI/button/DeleteButton";
import {useParams} from "react-router-dom";
import {fetchOnePet, updatePet} from "../../../API/PetService";

const UpdatePetForm = ({ setOnUpdateSuccess }) => {
    const inputs = [
        {label: "Кличка", name: 'petName', id: 'petName', type: 'text'},
        {label: "Вік тварини", name: 'petAge', id: 'petAge', type: 'number'},
        {label: "Стать", name: 'petGender', id: 'petGender', type: 'text'},
        {label: "Номер клітки", name: 'cellNumber', id: 'cellNumber', type: 'text'},
        {label: "Фото тварини", name: 'petImage', id: 'petImage', type: 'file'},
        {label: "Вид тварини", name: 'petKind', id: 'petKind', type: 'text'},
    ];
    const {id} = useParams();

    const [newPetData, setNewPetData] = useState({});
    const [errorList, setErrorList] = useState([new ValidationError()]);
    const [newPetInfo, setNewPetInfo] = useState([{}]);

    const handleAddInfo = (e) => {
        e.preventDefault();
        setNewPetInfo(prevInfo => [
            ...prevInfo,
            { title: '', description: '', id: Date.now() }
        ]);
    }

    const handleDeleteButton = (id) => {
        const filteredPetInfo = newPetInfo.filter(info => info.id !== id);
        setNewPetInfo(filteredPetInfo);
    }

    const changeInfo = (key, value, id) => {
        setNewPetInfo(newPetInfo.map(i => i.id === id ? {...i, [key]: value} : i))
    }


    const handleUpdatePet = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('petName', newPetData.petName);
            formData.append('petAge', newPetData.petAge);
            formData.append('petGender', newPetData.petGender);
            formData.append('cellNumber', newPetData.cellNumber);
            formData.append('petImage', newPetData.petImage);
            formData.append('info', JSON.stringify(newPetInfo));
            formData.append('petKind', newPetData.petKind)

            await updatePet(id, formData);
            setOnUpdateSuccess(true);
        } catch (error) {
            if (error.response) {
                if (error.response.code === 400) {
                    setErrorList(error.response.data.message);
                }
            }
        }
    }

    useEffect(() => {
        fetchOnePet(id).then(data => {
            setNewPetData({
                petName: data.pet_name,
                petAge: data.pet_age,
                petGender: data.pet_gender,
                cellNumber: data.cell_number,
                petImage: null,
                petKind: data.pet_kind,
                info: data.pet_characteristics
            });
            setNewPetInfo(data.pet_characteristics);
        });
    }, []);

    return (
        <GeneralForm
            inputs={inputs}
            data={newPetData}
            setData={setNewPetData}
            header={"Оновити тварину"}
            submitButtonText={"Оновити"}
            errorsList={errorList}
            onClick={handleUpdatePet}
        >
        <div className={stl.infoContainer}>
            <div className={stl.addInfoBtnContainer}>
                <div className={stl.addInfoBtn}>
                    <Button
                        buttonText={"Додати характеристику"}
                        onClick={handleAddInfo}
                    />
                </div>
            </div>
            <div className={stl.infoList}>
                {newPetInfo.map(info =>
                    <div key={info.id} className={stl.infoItem}>
                        <div className={stl.infoInput}>
                            <MyInput
                                value={info.title}
                                name={info.id}
                                label={"Назва"}
                                onChange={(e) => changeInfo('title', e.target.value, info.id)}
                            />
                        </div>
                        <div className={stl.infoInput}>
                            <MyInput
                                value={info.description}
                                name={info.id}
                                label={"Опис"}
                                onChange={(e) => changeInfo('description', e.target.value, info.id)}
                            />
                        </div>
                        <div className={stl.deleteBtn}>
                            <DeleteButton
                                buttonText={"Видалити"}
                                onClick={() => handleDeleteButton(info.id)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
        </GeneralForm>
    );
};

export default UpdatePetForm;