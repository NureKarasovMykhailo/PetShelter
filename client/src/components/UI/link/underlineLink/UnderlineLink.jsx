import React from 'react';
import styles from './UnderlineLink.module.css';
import {IMAGES} from "../../../../utils/const";

const UnderlineLink = ( { linkText, onClick }) => {
    return (
        <div onClick={onClick} className={styles.underlineLinkContainer}>
            <p className={styles.underlineLinkText}>{linkText}</p>
            <img
                className={styles.underlineLinkIcon}
                src={IMAGES.LINK_ICON}
                alt="Image not found"
            />
        </div>
    );
};

export default UnderlineLink;