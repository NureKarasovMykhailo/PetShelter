// FormError.jsx
import React, { useState } from 'react';
import styles from './FormError.module.css';
import {IMAGES} from "../../../../utils/const";

const FormError = ({ errors }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    const handleIconHover = () => {
        setTooltipVisible(true);
    };

    const handleIconLeave = () => {
        setTooltipVisible(false);
    };

    if (errors.length === 0) {
        return null; // Возвращаем null, чтобы компонент ничего не отрисовывал
    }

    return (
        <div className={styles.formErrorContainer}>
            <div className={styles.errorIcon} onMouseEnter={handleIconHover} onMouseLeave={handleIconLeave}>
                <img className={styles.errorImg} src={IMAGES.ERROR_ICON} alt="Error icon" />
                <p>подробиці..</p>
            </div>
            {isTooltipVisible && (
                <div className={styles.errorTooltip}>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error.msg};</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FormError;
