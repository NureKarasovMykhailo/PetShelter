import React from 'react';
import stl from './AllAdoptionOfferItem.module.css';
import Button from "../../UI/button/Button";
import {useNavigate} from "react-router-dom";
import {GENERAL_ADOPTION_OFFER_ROUTE} from "../../../utils/const";

const AllAdoptionOfferItem = ({adoptionOffer}) => {
    const navigate = useNavigate();

    return (
        <div className={stl.adoptionOfferItem}>
            <div className={stl.adoptionOfferImageContainer}>
                <img
                    src={process.env.REACT_APP_API_URL + adoptionOffer.pet.pet_image}
                    alt={"Image not found"}
                    className={stl.adoptionOfferImage}
                />
            </div>
            <div className={stl.adoptionOfferInfoContainer}>
                <p>Кличка: {adoptionOffer.pet.pet_name}</p>
                <p>Вік: {adoptionOffer.pet.pet_age}</p>
                <p>Стать: {adoptionOffer.pet.pet_gender}</p>
                <p>Ціна опекунства: {adoptionOffer.adoption_price}</p>
                <p>Адреса: {adoptionOffer.pet.shelter.shelter_address}</p>
            </div>
            <div className={stl.adoptionOfferButtonContainer}>
                <div className={stl.adoptionOfferBtn}>
                    <Button
                        buttonText={"Подробніше"}
                        onClick={() => {
                            navigate(GENERAL_ADOPTION_OFFER_ROUTE.replace(':id', adoptionOffer.id))
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AllAdoptionOfferItem;