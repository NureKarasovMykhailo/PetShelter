import React, {useContext, useEffect, useState} from 'react';
import stl from './FeederInfo.module.css';
import SelectInput from "../../UI/input/selectInput/SelectInput";
import Button from "../../UI/button/Button";
import {useParams} from "react-router-dom";
import {setFeeder} from "../../../API/FeederService";
import {Context} from "../../../index";
import {clearFeederInfo, deleteFeederInfo, fetchFeederInfo} from "../../../API/FeederInfoService";
import {observer} from "mobx-react-lite";
import DeleteButton from "../../UI/button/DeleteButton";


const FeederInfo = observer(({pet, feeder, feederInfo, onSuccessSet}) => {
    const [selectedFeeder, setSelectedFeeder] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const options = [];
    const { id } = useParams();

    feeder.map(f => {
        if (f.petId === null) {
            options.push({value: f.id, name: f.id})
        }
    });

    const handleSetFeeder = async () => {
        try {
            await setFeeder(selectedFeeder, id);
            onSuccessSet(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteFeederInfo = async () => {
        try {
            const petFeeder = feeder.filter(f => f.petId === pet.id);
            await clearFeederInfo(petFeeder[0].id);
            setIsUpdate(true);
            onSuccessSet(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteOneInfo = async (infoId) => {
        try {
            await deleteFeederInfo(infoId);
            onSuccessSet(true);
        } catch (error) {
            console.log(error);
        }
    }



    return (
        pet.feederId === null ?
            <div className={stl.feederSelectContainer}>
                <div className={stl.feederSelectHeader}>
                    <h3>Оберіть годівницю</h3>
                </div>
                <div className={stl.selectFeeder}>
                    <SelectInput
                        options={options}
                        value={selectedFeeder}
                        setValue={setSelectedFeeder}
                        defaultValue={"ID годівниці"}
                    />
                </div>
                <div className={stl.selectFeederBtnContainer}>
                    <div className={stl.selectFeederButton}>
                        <Button
                            buttonText={"Закріпити годівницю"}
                            onClick={handleSetFeeder}
                            isDisable={selectedFeeder === ''}
                        />
                    </div>
                </div>
            </div>
            :
            <div className={stl.feederInfoContainer}>
                <div className={stl.feederInfoHeader}>
                    <h3>Інформаці про годування</h3>
                </div>
                <div className={stl.feederInfoItemsContainer}>
                    {feederInfo.length !== 0 ?
                        <div>
                            <table className={stl.feederInfoTable}>
                                <thead>
                                <tr>
                                    <th>Час годування</th>
                                    <th>Кількість споживаної їжі (гр.)</th>
                                    <th>Повідомлення</th>
                                    <th>Видалення</th>
                                </tr>
                                </thead>
                                <tbody>
                                {feederInfo.map(info =>
                                    <tr key={info.id} className={stl.feederInfoRow}>
                                        <td>{new Date(info.createdAt).toLocaleString()}</td>
                                        <td>{info.amount_of_food}</td>
                                        <td>{info.message}</td>
                                        <td>
                                            <DeleteButton
                                                buttonText={"Видалити"}
                                                onClick={() => handleDeleteOneInfo(info.id)}
                                            />
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div className={stl.feederInfoClearBtn}>
                                <DeleteButton
                                    buttonText={"Очистити інформаці"}
                                    onClick={handleDeleteFeederInfo}
                                />
                            </div>
                        </div>
                        :
                        <div>
                            Інформація про годування відсутня
                        </div>
                    }

                </div>
            </div>
    );
});

export default FeederInfo;