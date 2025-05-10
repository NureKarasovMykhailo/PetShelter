import React, { useState } from 'react';
import stl from './CollarInfo.module.css';
import SelectInput from '../../UI/input/selectInput/SelectInput';
import Button from '../../UI/button/Button';
import { useParams } from 'react-router-dom';
import { setCollar } from '../../../API/CollarService';
import DeleteButton from '../../UI/button/DeleteButton';
import { clearCollarInfo, deleteCollarInfo } from '../../../API/CollarInfoService';
import {useTranslation} from "react-i18next";

const CollarInfo = ({ pet, collars, collarInfo, setSuccessSet }) => {
    const [selectedCollar, setSelectedCollar] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const options = [];
    const { id } = useParams();
    const { t } = useTranslation();

    collars.map(collar => {
        if (collar.petId === null) {
            options.push({ value: collar.id, name: collar.id })
        }
    });

    const handleSetCollar = async () => {
        try {
            await setCollar(selectedCollar, id)
            setSuccessSet(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteOneInfo = async (infoId) => {
        try {
            await deleteCollarInfo(infoId);
            setSuccessSet(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClearInfo = async () => {
        try {
            await clearCollarInfo(pet.collarId);
            setSuccessSet(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        pet.collarId === null ?
            <div className={stl.collarSelectContainer}>
                <div className={stl.collarSelectHeader}>
                    <h3>{t('selectCollarHeader')}</h3>
                </div>
                <div className={stl.selectCollar}>
                    <SelectInput
                        options={options}
                        value={selectedCollar}
                        setValue={setSelectedCollar}
                        defaultValue={t('selectCollar')}
                    />
                </div>
                <div className={stl.selectCollarBtnContainer}>
                    <div className={stl.selectCollarButton}>
                        <Button
                            buttonText={t('selectCollarButton')}
                            onClick={handleSetCollar}
                            isDisable={selectedCollar === ''}
                        />
                    </div>
                </div>
            </div>
            :
            <div className={stl.feederInfoContainer}>
                <div className={stl.feederInfoHeader}>
                    <h3>{t('infoHeader')}</h3>
                </div>
                <div className={stl.feederInfoItemsContainer}>
                    {collarInfo.length !== 0 ?
                        <div>
                            <table className={stl.feederInfoTable}>
                                <thead>
                                <tr>
                                    <th>Час отримання даних</th>
                                    <th>Температура (°C)</th>
                                    <th>Пульс (ударів/хвилина)</th>
                                    <th>Чи знаходиться в заданому радіусі</th>
                                    <th>Повідомлення</th>
                                    <th>{t('deleteButton')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collarInfo.map(info =>
                                    <tr key={info.id} className={stl.feederInfoRow}>
                                        <td>{new Date(info.createdAt).toLocaleString()}</td>
                                        <td>{info.temperature}</td>
                                        <td>{info.pulse}</td>
                                        <td>{info.in_safe_radius ? "У безпеці" : "За межами"}</td>
                                        <td>{info.message}</td>
                                        <td>
                                            <DeleteButton
                                                buttonText={t('deleteButton')}
                                                onClick={() => handleDeleteOneInfo(info.id)}
                                            />
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div className={stl.feederInfoClearBtn}>
                                <DeleteButton
                                    buttonText={t('clearInfoButton')}
                                    onClick={handleClearInfo}
                                />
                            </div>
                        </div>
                        :
                        <div>
                            {t('noInfoMessage')}
                        </div>
                    }
                </div>
            </div>
    );
};

export default CollarInfo;
