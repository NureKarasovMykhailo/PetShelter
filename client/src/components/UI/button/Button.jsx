import React from "react";
import styles from "./Button.module.css";

const Button = ({ buttonText, onClick, isDisable = false}) => {
    return (

           <button className={styles.Button}  onClick={onClick} disabled={isDisable}>
               {buttonText}
           </button>

    );
}

export default Button;