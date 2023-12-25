import React, {useEffect, useState} from 'react';
import {adminFetchAllAdoptionOffers} from "../../../API/AdoptionOfferService";
import Table from "../table/Table";

const AdoptionOffersTable = () => {
    const headers = [
        'id',
        'adoption_price',
        'adoption_telephone',
        'adoption_email',
        'adoption_info',
        'createdAt',
        'updatedAt',
        'petId'
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [adoptionOffers, setAdoptionOffers] = useState([{}]);

    useEffect(() => {
        setIsLoading(true);
        adminFetchAllAdoptionOffers().then(data => {
            setAdoptionOffers(data.adoptionOffer);
            setIsLoading(false);
        })
    }, []);

    return (
        <div>
            <Table
                isLoading={isLoading}
                headers={headers}
                data={adoptionOffers}
            />
        </div>
    );
};

export default AdoptionOffersTable;