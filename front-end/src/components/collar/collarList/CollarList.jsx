import React from 'react';
import CollarItem from "../collarItem/CollarItem";
import Button from "../../UI/button/Button";
import DeleteButton from "../../UI/button/DeleteButton";

const CollarList = ({ collars, setOnSuccess }) => {
    return (
        <>
            {collars.map(collar => (
                <CollarItem key={collar.id} collar={collar} setOnSuccess={(success) => setOnSuccess(success)}/>
            ))}
        </>
    );
};

export default CollarList;
