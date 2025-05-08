import React from 'react';
import ApplicationForAdoptionItem from "../applicationForAdoptionItem/ApplicationForAdoptionItem";

const ApplicationForAdoptionList = ({applicationsForAdoption, setRefresh}) => {
    return (
        applicationsForAdoption.map(application =>
            <ApplicationForAdoptionItem
                applicationForAdoption={application}
                setRefresh={(refresh) => setRefresh(refresh)}
            />
        )
    );
};

export default ApplicationForAdoptionList;