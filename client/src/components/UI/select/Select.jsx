import React from "react";
import styles from "./Select.module.css";

const Select = ({ options, onChange, value }) => {
    return (
        <select
            className={styles.selector}
            onChange={event => onChange(event.target.value)}
            value={value}
        >
            {options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
            ))}
        </select>
    );
}

export default Select;
