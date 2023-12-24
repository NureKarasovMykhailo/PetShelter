import React from 'react';
import WorkOfferItem from "../workOfferItem/WorkOfferItem";

const WorkOfferList = ({ workOffers, setRefresh, isPublic = false }) => {
    return (
        !isPublic
            ?
            workOffers.map(workOffer =>
                <WorkOfferItem
                    key={workOffer.id}
                    workOffer={workOffer}
                    setRefresh={(isRefresh) => setRefresh(isRefresh)}
                />
            )
            :
            workOffers.map(workOffer =>
                <WorkOfferItem
                    key={workOffer.id}
                    workOffer={workOffer}
                    setRefresh={(isRefresh) => setRefresh(isRefresh)}
                    isPublic={isPublic}
                />
            )
    );
};

export default WorkOfferList;