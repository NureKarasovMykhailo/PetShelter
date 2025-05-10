import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Иконки из библиотеки react-icons
import styles from './PasswordInput.module.css';

const PasswordInput = ({ label, id, name, placeholder, onChange, value }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className={styles.passwordInputContainer}>
            <label className={styles.passwordLabel} htmlFor={id}>{label}:</label>
            <div className={styles.passwordInputWrapper}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                    className={styles.passwordInputField}
                />
                <button
                    type="button"
                    onClick={handleTogglePassword}
                    className={styles.passwordToggleButton}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
