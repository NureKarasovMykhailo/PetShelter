import React, {useEffect, useState} from 'react';
import GeneralForm from "../../forms/generalForm/GeneralForm";
import ValidationError from "../../../class/ValidationError";
import {createEmployee} from "../../../API/EmployeeService";
import {createFeeder, fetchFeeder, updateFeeder} from "../../../API/FeederService";

const AddFeederForm = ({ onSucceedAdd }) => {
    const inputs = [
        {label: 'Місткість', id: 'capacity', name: 'capacity', type: 'number'},
        {label: 'Колір', id: 'feederColour', name: 'feederColour', type: 'text'},
        {label: 'Розроблена для', id: 'designedFor', name: 'designedFor', type: 'text'},
    ];
    const [errorList, setErrorList] = useState([new ValidationError()]);
    const [data, setData] = useState({
        capacity: '',
        feederColour: '',
        designedFor: '',
    });

    const handleAddFeeder = async (e) => {
        e.preventDefault();
        try {
            await createFeeder(data);
            onSucceedAdd(true);
        } catch (error) {
            if (error.response.status === 400) {
                setErrorList(error.response.data.message);
            }
        }
    }


    return (
        <GeneralForm
            inputs={inputs}
            data={data}
            setData={setData}
            header={"Додавання годівниці"}
            submitButtonText={"Додати"}
            errorsList={errorList}
            onClick={handleAddFeeder}
        >

        </GeneralForm>
    );
};

export default AddFeederForm;