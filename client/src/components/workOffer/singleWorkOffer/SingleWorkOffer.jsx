import React from 'react';
import stl from './SingleWorkOffer.module.css';

const SingleWorkOffer = ({workOffer}) => {
    return (
        <div className={stl.workOfferContainer}>
            <div className={stl.additionalInfoContainer}>
                <p>{workOffer.shelter.shelter_name}</p>
                <p>{workOffer.shelter.shelter_address}</p>
                <p>Email: {workOffer.work_email}</p>
                <p>{workOffer.work_telephone}</p>
            </div>
            <div className={stl.workOfferInfoContainer}>
                <div className={stl.workOfferTitleContainer}>
                    <h2>{workOffer.work_title}</h2>
                </div>
                <div className={stl.workDescription}>
                    <p>{workOffer.work_description}</p>
                </div>
            </div>
        </div>
    );
};

export default SingleWorkOffer;