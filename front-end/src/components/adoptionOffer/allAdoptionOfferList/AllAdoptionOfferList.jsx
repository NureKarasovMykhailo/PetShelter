import React from 'react';
import AllAdoptionOfferItem from "../allAdoptionOfferItem/AllAdoptionOfferItem";

const AllAdoptionOfferList = ({adoptionOffers}) => {
    return (
        <div>
            {adoptionOffers.map(adoptionOffer =>
                <AllAdoptionOfferItem
                    adoptionOffer={adoptionOffer}
                />
            )}
        </div>
    );
};

export default AllAdoptionOfferList;