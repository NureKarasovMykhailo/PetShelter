import React from "react";
import styles from "./ImageWithLink.module.css";

const ImageWithLink = ({imgSrc, alt, linkText, href}) => {
    return (
        <div className={styles.imageWithLinkContainer}>
            <img className={styles.image} src={imgSrc} alt={alt} />
            <a className={styles.link} href={href}>{linkText}</a>
        </div>
    );
}

export default ImageWithLink;