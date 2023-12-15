import React from "react";
import styles from "./MyInput.module.css";

const MyInput = ({label, id, type, name, onChange, placeholder, value}) => {
    return (
        <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor={id}>{label}:</label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles.inputField}
            />
        </div>

    );
}


export default MyInput;