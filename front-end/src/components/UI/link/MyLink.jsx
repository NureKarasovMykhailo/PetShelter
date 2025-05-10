import React from 'react';
import styles from './MyLink.module.css';

const MyLink = ({ linkText, onClick }) => {
    return (
        <p className={styles.link} onClick={onClick}>
            {linkText}
        </p>
    );
};

export default MyLink;