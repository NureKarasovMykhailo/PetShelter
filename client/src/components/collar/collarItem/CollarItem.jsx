// CollarItem.jsx

import React, { useState } from 'react';
import stl from './CollarItem.module.css';
import Button from "../../UI/button/Button";
import DeleteButton from "../../UI/button/DeleteButton";
import Modal from "../../UI/modal/Modal";
import UpdateCollarForm from "../updateCollarForm/UpdateCollarForm";
import { deleteCollar } from "../../../API/CollarService";
import { useTranslation } from "react-i18next";

const CollarItem = ({ collar, setOnSuccess }) => {
    const { t } = useTranslation();
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
                    <th>{t("minTemperatureLabel")} (°C)</th>
                    <th>{t("maxTemperatureLabel")} (°C)</th>
                    <th>{t("minPulseLabel")} (удари/хв)</th>
                    <th>{t("maxPulseLabel")} (удари/хв)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{collar.id}</td>
                    <td>{collar.min_temperature} C</td>
                    <td>{collar.max_temperature} C</td>
                    <td>{collar.min_pulse} {t("pulsesPerMinute")}</td>
                    <td>{collar.max_pulse} {t("pulsesPerMinute")}</td>
                </tr>
                </tbody>
            </table>
            <div className={stl.collarItemBtnContainer}>
                <Button
                    buttonText={t("edit")}
                    onClick={() => setIsUpdateModalActive(true)}
                />
                <DeleteButton
                    buttonText={t("delete")}
                    onClick={handleDeleteCollar}
                />
            </div>
            <Modal
                active={isUpdateModalActive}
                setActive={setIsUpdateModalActive}
            >
                <UpdateCollarForm collar={collar} setOnSuccess={handleUpdateSuccess} />
            </Modal>
        </div>
    );
};

export default CollarItem;
