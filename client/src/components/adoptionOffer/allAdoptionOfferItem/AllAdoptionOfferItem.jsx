// AllAdoptionOfferItem.jsx

import React from 'react';
import stl from './AllAdoptionOfferItem.module.css';
import Button from "../../UI/button/Button";
import { useNavigate } from "react-router-dom";
import { GENERAL_ADOPTION_OFFER_ROUTE } from "../../../utils/const";
import { useTranslation } from "react-i18next";

const AllAdoptionOfferItem = ({ adoptionOffer }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className={stl.adoptionOfferItem}>
            <div className={stl.adoptionOfferImageContainer}>
                <img
                    src={process.env.REACT_APP_API_URL + adoptionOffer.pet.pet_image}
                    alt={t("imageNotFound")}
                    className={stl.adoptionOfferImage}
                />
            </div>
            <div className={stl.adoptionOfferInfoContainer}>
                <p>{t("nameLabel")}: {adoptionOffer.pet.pet_name}</p>
                <p>{t("ageLabel")}: {adoptionOffer.pet.pet_age}</p>
                <p>{t("genderLabel")}: {adoptionOffer.pet.pet_gender}</p>
                <p>{t("adoptionPriceLabel")}: {adoptionOffer.adoption_price}</p>
                <p>{t("addressLabel")}: {adoptionOffer.pet.shelter.shelter_address}</p>
            </div>
            <div className={stl.adoptionOfferButtonContainer}>
                <div className={stl.adoptionOfferBtn}>
                    <Button
                        buttonText={t("details")}
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
