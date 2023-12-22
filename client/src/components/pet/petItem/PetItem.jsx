import React from 'react';
import stl from './PetItem.module.css';
import Button from "../../UI/button/Button";
import {deletePet} from "../../../API/PetService";
import {useNavigate} from "react-router-dom";
import {CHANGE_PASSWORD_PAGE, ONE_PET_ROUTE} from "../../../utils/const";

const PetItem = ({ pet, onDelete }) => {
    const navigate = useNavigate();

    const handleDeletePet = async () => {
        try {
            await deletePet(pet.id);
            onDelete(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDetailClick = () => {
        navigate(ONE_PET_ROUTE.replace(':id', pet.id));
    }

    return (
        <div className={stl.petItemContainer}>
            <div className={stl.petItemImageContainer}>
                <img
                    className={stl.petItemImage}
                    src={process.env.REACT_APP_API_URL + pet.pet_image}
                    alt={"Image not found"}
                />
            </div>
            <div className={stl.petItemCharacteristics}>
                <p><b>ID:</b> {pet.id}</p>
                <p>Кличка: {pet.pet_name}</p>
                <p>Вид: {pet.pet_kind}</p>
                <p>Вік: {pet.pet_age}</p>
            </div>
            <div className={stl.petItemCharacteristics}>
                <p>Стать: {pet.pet_gender}</p>
                <p>Вік: {pet.pet_age}</p>
                <p>Номер клітки: {pet.cell_number}</p>
            </div>
            <div className={stl.petItemButtonsContainer}>
                <div className={stl.petItemButton}>
                    <Button
                        buttonText={"Інформація"}
                        onClick={() => navigate(ONE_PET_ROUTE.replace(':id', pet.id))}
                    />
                </div>
                <div className={stl.petItemButton}>
                    <Button
                        buttonText={"Видалити"}
                        onClick={handleDeletePet}
                    />
                </div>
            </div>
        </div>
    );
};

export default PetItem;