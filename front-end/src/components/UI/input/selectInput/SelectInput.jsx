import React, {useState} from 'react';
import stl from './SelectInput.module.css';

const SelectInput = ({ options, setValue, defaultValue }) => {

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setValue(selectedValue);
    };


    return (
        <div className={stl.selectContainer}>
            <select
                className={stl.select}
                onChange={handleSelectChange}
            >
                <option disabled={true}>{defaultValue}</option>
                {options.map(option =>
                    <option
                        value={option.value}
                        key={option.value}
                        onClick={() => setValue(option.value)}
                    >
                        {option.name}
                    </option>
                )}
            </select>
        </div>
    );
};

export default SelectInput;

