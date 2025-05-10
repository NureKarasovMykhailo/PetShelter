import React from "react";
import styles from "./DeleteButton.module.css";

const DeleteButton = ({ buttonText, onClick, isDisable = false, value}) => {
    return (

        <button className={styles.Button}  onClick={onClick} disabled={isDisable} name={value}>
            {buttonText}
        </button>

    );
}

export default DeleteButton;