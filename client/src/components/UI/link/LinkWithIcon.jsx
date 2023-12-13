import React from "react";
import styles from "./LinkWithIcon.module.css";
import {useNavigate} from "react-router-dom";
import {SUBSCRIBE_ROUTE} from "../../../utils/const";

const LinkWithIcon = ({ imgSrc, alt, text }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(SUBSCRIBE_ROUTE)
    };
    return (
        <div className={styles.linkContainer} onClick={handleClick}>
            <img className={styles.linkIcon}  src={imgSrc} alt={alt} />
            <p className={styles.linkText}>{text}</p>
        </div>
    );
};


export default LinkWithIcon;