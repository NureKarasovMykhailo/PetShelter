import React from 'react';
import AdoptionOfferItem from "../adoptionOfferItem/AdoptionOfferItem";

const AdoptionOfferList = ({adoptionOffers, setRefresh}) => {

    return (
        adoptionOffers.map(adoptionOffer =>
            <AdoptionOfferItem
                key={adoptionOffer.id}
                adoptionOffer={adoptionOffer}
                setRefresh={(refresh) => setRefresh(refresh)}
            />
        )
    );
};

export default AdoptionOfferList;