// PetItem.js
import React from 'react';
import stl from './PetItem.module.css';
import { useTranslation } from 'react-i18next';
import Button from "../../UI/button/Button";
import { deletePet } from "../../../API/PetService";
import { useNavigate } from "react-router-dom";
import { ONE_PET_ROUTE } from "../../../utils/const";

const PetItem = ({ pet, onDelete }) => {
    const { t } = useTranslation();
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
                    alt={t('imageNotFound')}
                />
            </div>
            <div className={stl.petItemCharacteristics}>
                <p><b>{t('id')}:</b> {pet.id}</p>
                <p>{t('name')}: {pet.pet_name}</p>
                <p>{t('species')}: {pet.pet_kind}</p>
                <p>{t('age')}: {pet.pet_age}</p>
            </div>
            <div className={stl.petItemCharacteristics}>
                <p>{t('gender')}: {pet.pet_gender}</p>
                <p>{t('age')}: {pet.pet_age}</p>
                <p>{t('cageNumber')}: {pet.cell_number}</p>
            </div>
            <div className={stl.petItemButtonsContainer}>
                <div className={stl.petItemButton}>
                    <Button
                        buttonText={t('petDetails')}
                        onClick={() => navigate(ONE_PET_ROUTE.replace(':id', pet.id))}
                    />
                </div>
                <div className={stl.petItemButton}>
                    <Button
                        buttonText={t('delete')}
                        onClick={handleDeletePet}
                    />
                </div>
            </div>
        </div>
    );
};

export default PetItem;
