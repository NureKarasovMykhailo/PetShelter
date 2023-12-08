import React from "react";
import styles from "./Select.module.css";

const Select = ({ options, onChange }) => {
    return (
        <select className={styles.selector} onChange={onChange}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
            ))}
        </select>
    );
}

export default Select;
