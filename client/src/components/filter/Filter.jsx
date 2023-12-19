import React from 'react';
import styles from './filter.module.css';
import MySelect from "../UI/input/mySelect/MySelect";
import Button from "../UI/button/Button";

const Filter = ( {filters, data, setData} ) => {

    const onChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const onRefreshClick = () => {
        const emptyData = {};
        Object.keys(data).forEach((key) => {
            emptyData[key] = '';
        });
        setData(emptyData);
    }

    return (
        <div className={styles.filterContainer}>
            <h3>Фільтер</h3>
            {filters.map((filter) =>
                <div className={styles.filterFields}>
                    <div className={styles.filterFieldsLabel}>
                        <p>{filter.label}</p>
                    </div>
                    <MySelect
                        options={filter.options}
                        onChange={onChange}
                        defaultValue={filter.defaultValue}
                        value={data}
                        name={filter.name}
                    />
                </div>
            )}
            <div>
                <div className={styles.filterButton}>
                    <Button
                        buttonText={"Збросити"}
                        onClick={onRefreshClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default Filter;