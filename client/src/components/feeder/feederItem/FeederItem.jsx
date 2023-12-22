import React, {useState} from 'react';
import stl from './FeederItem.module.css';
import Button from "../../UI/button/Button";
import {deleteFeeder, updateFeeder} from "../../../API/FeederService";
import Modal from "../../UI/modal/Modal";
import ValidationError from "../../../class/ValidationError";
import GeneralForm from "../../forms/generalForm/GeneralForm";
import DeleteButton from "../../UI/button/DeleteButton";

const FeederItem = ({ feeder, user, onSuccessDelete, onSuccessUpdate}) => {
    const [updateModalActive, setUpdateModalActive] = useState(false);
    const [errorList, setErrorList] = useState([new ValidationError()]);
    const [newFeederData, setNewFeederData] = useState({
        capacity: feeder.capacity,
        designedFor: feeder.designed_for,
        feederColour: feeder.feeder_colour,
    });

    const updateInputs = [
        {label: 'Місткість', id: 'capacity', name: 'capacity', type: 'number'},
        {label: 'Колір', id: 'feederColour', name: 'feederColour', type: 'text'},
        {label: 'Розроблена для', id: 'designedFor', name: 'designedFor', type: 'text'},
    ];


    const handleDeleteFeeder = async () => {
        try {
            await deleteFeeder(feeder.id);
            onSuccessDelete(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateFeeder = async (e) => {
        e.preventDefault();
        try {
            await updateFeeder(feeder.id, newFeederData);
            onSuccessUpdate(true);
            setUpdateModalActive(false);
        } catch (error) {
            if (error.response.status === 400) {
                setErrorList(error.response.data.message);
            }
        }
    }

    return (
        <div className={stl.feederItemContainer}>
            <table className={stl.feederTable}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Колір</th>
                    <th>Об'м (л.)</th>
                    <th>Спроектована для</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{feeder.id}</td>
                    <td>{feeder.feeder_colour}</td>
                    <td>{feeder.capacity}</td>
                    <td>{feeder.designed_for}</td>
                </tr>
                </tbody>
            </table>
            {user.roles.includes('subscriber') &&
                <div className={stl.feederItemBtnContainer}>
                    <div className={stl.feederItemButton}>
                        <Button
                            buttonText={"Оновити"}
                            onClick={() => setUpdateModalActive(true)}
                        />
                    </div>
                    <div className={stl.feederItemButton}>
                        <DeleteButton
                            buttonText={"Видалити"}
                            onClick={handleDeleteFeeder}
                        />
                    </div>
                </div>
            }
            <Modal
                active={updateModalActive}
                setActive={setUpdateModalActive}
            >
                <GeneralForm
                    data={newFeederData}
                    setData={setNewFeederData}
                    inputs={updateInputs}
                    header={"Оновити годівницю"}
                    errorsList={errorList}
                    submitButtonText={"Оновити"}
                    onClick={handleUpdateFeeder}
                />
            </Modal>
        </div>
    );
};

export default FeederItem;