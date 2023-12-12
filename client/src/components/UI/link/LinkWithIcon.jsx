import React from "react";
import styles from "./LinkWithIcon.module.css";

const LinkWithIcon = ({imgSrc, alt, text, href}) => {
    return (
        <div className={styles.linkContainer}>
            <img className={styles.linkIcon} src={imgSrc} alt={alt}/>
            <a className={styles.linkText} href={href}>{text}</a>
        </div>
    );
}

export default LinkWithIcon;