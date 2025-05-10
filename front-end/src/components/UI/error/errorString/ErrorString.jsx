import React from 'react';
import {IMAGES} from "../../../../utils/const";
import styles from './ErrorString.module.css';

const ErrorString = ({errorText}) => {
    if (errorText.length === 0) {
        return null;
    }
    return (
        <div className={styles.errorStringContainer}>
            <img className={styles.errorStringImg} src={IMAGES.ERROR_ICON} alt="Image not found" />
            <p className={styles.errorStringText}>{errorText}</p>
        </div>
    );
};

export default ErrorString;