import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './filter.module.css';
import MySelect from '../UI/input/mySelect/MySelect';
import Button from '../UI/button/Button';

const Filter = ({ filters, data, setData }) => {
    const { t } = useTranslation();

    const onChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onRefreshClick = () => {
        const emptyData = {};
        Object.keys(data).forEach((key) => {
            emptyData[key] = '';
        });
        setData(emptyData);
    };

    return (
        <div className={styles.filterContainer}>
            <h3>{t('filter')}</h3>
            {filters.map((filter) => (
                <div key={filter.name} className={styles.filterField}>
                    <label className={styles.filterLabel} htmlFor={filter.name}>
                        {t(filter.label)}
                    </label>
                    <MySelect
                        options={filter.options}
                        onChange={onChange}
                        defaultValue={filter.defaultValue}
                        value={data}
                        name={filter.name}
                        placeholder={t('selectPlaceholder')}
                    />
                </div>
            ))}
            <div>
                <div className={styles.filterButton}>
                    <Button buttonText={t('reset')} onClick={onRefreshClick} />
                </div>
            </div>
        </div>
    );
};

export default Filter;
