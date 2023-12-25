import React from 'react';
import { useTranslation } from 'react-i18next';
import MyInput from '../../UI/input/MyInput/MyInput';
import stl from './AddFeture.module.css';
import Button from '../../UI/button/Button';
import DeleteButton from '../../UI/button/DeleteButton';

const AddFeature = ({ info, data, setData, petData, setPetData }) => {
    const { t } = useTranslation();

    const changeInfo = (e) => {
        const { name, value } = e.target;
        data.map((d) => {
            if (d.number === info.number) {
                d[name] = value;
            }
        });
        setData(data);
        setPetData((prevState) => ({
            ...prevState,
            info: data,
        }));
    };

    const removeInfo = (e) => {
        e.preventDefault();
        const updatedData = data.filter((d) => d.number !== info.number);
        setData(updatedData);
        setPetData((prevData) => ({
            ...prevData,
            info: updatedData,
        }));
    };

    return (
        <div className={stl.container}>
            <MyInput
                placeholder={t('name')}
                label={t('name')}
                name="title"
                value={data['title']}
                onChange={changeInfo}
            />
            <MyInput
                placeholder={t('black')}
                label={t('description')}
                name="description"
                value={data['description']}
                onChange={changeInfo}
            />
            <div className={stl.deleteBtn}>
                <DeleteButton buttonText={t('delete')} onClick={removeInfo} />
            </div>
        </div>
    );
};

export default AddFeature;
