// FeederItem.js

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import stl from './FeederItem.module.css';
import Button from "../../UI/button/Button";
import { deleteFeeder, updateFeeder } from "../../../API/FeederService";
import Modal from "../../UI/modal/Modal";
import ValidationError from "../../../class/ValidationError";
import GeneralForm from "../../forms/generalForm/GeneralForm";
import DeleteButton from "../../UI/button/DeleteButton";

const FeederItem = ({ feeder, user, onSuccessDelete, onSuccessUpdate }) => {
    const { t } = useTranslation();

    const [updateModalActive, setUpdateModalActive] = useState(false);
    const [errorList, setErrorList] = useState([new ValidationError()]);
    const [newFeederData, setNewFeederData] = useState({
        capacity: feeder.capacity,
        designedFor: feeder.designed_for,
        feederColour: feeder.feeder_colour,
    });

    const updateInputs = [
        { label: t('capacityLabel'), id: 'capacity', name: 'capacity', type: 'number' },
        { label: t('colorLabel'), id: 'feederColour', name: 'feederColour', type: 'text' },
        { label: t('designedForLabel'), id: 'designedFor', name: 'designedFor', type: 'text' },
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
                    <th>{t('idLabel')}</th>
                    <th>{t('colorLabel')}</th>
                    <th>{t('capacityLabel')}</th>
                    <th>{t('designedForLabel')}</th>
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
                            buttonText={t('updateButton')}
                            onClick={() => setUpdateModalActive(true)}
                        />
                    </div>
                    <div className={stl.feederItemButton}>
                        <DeleteButton
                            buttonText={t('deleteButton')}
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
                    header={t('updateHeader')}
                    errorsList={errorList}
                    submitButtonText={t('updateButton')}
                    onClick={handleUpdateFeeder}
                />
            </Modal>
        </div>
    );
};

export default FeederItem;
