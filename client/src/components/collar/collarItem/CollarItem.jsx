import React, {useState} from 'react';
import stl from './CollarItem.module.css';
import Button from "../../UI/button/Button";
import DeleteButton from "../../UI/button/DeleteButton";
import Modal from "../../UI/modal/Modal";
import UpdateCollarForm from "../updateCollarForm/UpdateCollarForm";
import {deleteCollar} from "../../../API/CollarService";

const CollarItem = ({ collar, setOnSuccess }) => {
    const [isUpdateModalActive, setIsUpdateModalActive] = useState(false);

    const handleUpdateSuccess = (success) => {
        setOnSuccess(success);
        setIsUpdateModalActive(false);
    }

    const handleDeleteCollar = async () => {
        try {
            await deleteCollar(collar.id);
            setOnSuccess(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={stl.collarItemContainer}>
            <table className={stl.collarTable}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Мін. температура (°C)</th>
                    <th>Макс. температура (°C)</th>
                    <th>Мін. пульс (удари/хв)</th>
                    <th>Макс. пульс (удари/хв)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{collar.id}</td>
                    <td>{collar.min_temperature} C</td>
                    <td>{collar.max_temperature} C</td>
                    <td>{collar.min_pulse} ударів/хв</td>
                    <td>{collar.max_pulse} ударів/хв</td>
                </tr>
                </tbody>
            </table>
            <div className={stl.collarItemBtnContainer}>
                <Button
                    buttonText={"Редагувати"}
                    onClick={() => setIsUpdateModalActive(true)}
                />
                <DeleteButton
                    buttonText={"Видалити"}
                    onClick={handleDeleteCollar}
                />
            </div>
            <Modal
                active={isUpdateModalActive}
                setActive={setIsUpdateModalActive}
            >
                <UpdateCollarForm collar={collar} setOnSuccess={handleUpdateSuccess}/>
            </Modal>
        </div>
    );
};

export default CollarItem;
