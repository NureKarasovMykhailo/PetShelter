import React from 'react';
import style from './MySelect.module.css';

const MySelect = ({ options, value, onChange, defaultValue, name }) => {
    return (
        <div className={style.selectContainer}>
            <select
                name={name}
                className={style.mySelect}
                value={value[name]}
                onChange={(e) => onChange(e)}
            >
                <option disabled value="">{defaultValue}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value} name={option.name}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MySelect;

