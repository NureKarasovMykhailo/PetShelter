import React from 'react';
import stl from './AdoptionOfferItem.module.css';
import Button from "../../UI/button/Button";
import DeleteButton from "../../UI/button/DeleteButton";
import {deleteAdoptionOffer} from "../../../API/AdoptionOfferService";
import {APPLICATION_FOR_ADOPTION_PAGE, ONE_ADOPTION_OFFER_ROUTE, ONE_PET_ROUTE} from "../../../utils/const";
import {useNavigate} from "react-router-dom";

const AdoptionOfferItem = ({adoptionOffer, setRefresh}) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteAdoptionOffer(adoptionOffer.id);
            setRefresh(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={stl.adoptionOfferItem}>
            <div className={stl.adoptionOfferImageContainer}>
                <img
                    src={process.env.REACT_APP_API_URL + adoptionOffer.pet.pet_image}
                    alt={"Image not found"}
                    className={stl.adoptionOfferImage}
                />
            </div>
            <div className={stl.adoptionOfferInfo}>
                <p>Кличка: {adoptionOffer.pet.pet_name}</p>
                <p>Вік: {adoptionOffer.pet.pet_age}</p>
                <p>Стать: {adoptionOffer.pet.pet_gender}</p>
                <p>Ціна опекунства: {adoptionOffer.adoption_price} грн</p>
            </div>
            <div className={stl.adoptionButtonsContainer}>
                <div className={stl.adoptionOfferButton}>
                    <Button
                        buttonText={"Заяви"}
                        onClick={() => {
                            navigate(APPLICATION_FOR_ADOPTION_PAGE.replace(':id', adoptionOffer.id))
                        }}
                    />
                </div>
                <div className={stl.adoptionOfferButton}>
                    <Button
                        buttonText={"Переглянути"}
                        onClick={() => navigate(ONE_ADOPTION_OFFER_ROUTE.replace(':id', adoptionOffer.id))}
                    />
                </div>
                <div className={stl.adoptionOfferButton}>
                    <DeleteButton
                        buttonText={"Видалити"}
                        onClick={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdoptionOfferItem;