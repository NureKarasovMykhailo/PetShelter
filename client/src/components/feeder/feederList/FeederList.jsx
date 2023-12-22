import React from 'react';
import FeederItem from "../feederItem/FeederItem";

const FeederList = ({ feeders, user, onSuccessDelete, onSuccessUpdate }) => {
    const handleDeleteFeeder = (deleteSuccess) => {
        onSuccessDelete(deleteSuccess)
    }

    return (
        feeders.map((feeder) =>
            <FeederItem
                key={feeder.id}
                feeder={feeder}
                user={user}
                onSuccessDelete={handleDeleteFeeder}
                onSuccessUpdate={(updateSuccess) => onSuccessDelete(updateSuccess)}
            />
        )
    );
};

export default FeederList;