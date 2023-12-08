import React from "react";
import styles from "./Button.module.css";

const Button = ({ buttonText, onClick}) => {
    return (
        <button className={styles.Button}  onClick={onClick}>
            {buttonText}
        </button>
    );
}

export default Button;