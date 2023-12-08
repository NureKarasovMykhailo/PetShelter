import React from "react";
import styles from "./Link.module.css";

const Link = ({imgSrc, alt, text, href}) => {
    return (
        <div className={styles.linkContainer}>
            <img className={styles.linkIcon} src={imgSrc} alt={alt}/>
            <a className={styles.linkText} href={href}>{text}</a>
        </div>
    );
}

export default Link;