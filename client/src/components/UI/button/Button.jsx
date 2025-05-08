import React from "react";
import styles from "./Button.module.css";

const Button = ({ buttonText, onClick, isDisable = false, value}) => {
    return (

           <button className={styles.Button}  onClick={onClick} disabled={isDisable} name={value}>
               {buttonText}
           </button>

    );
}

export default Button;