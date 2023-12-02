import React from 'react';
import styles from '../styles/Footer.module.css';
import logo from '../images/logo.png'
import aboutImg from '../images/aboutFooter.png';
import contactsImg from '../images/contactsFooter.png';
import workTogetherImg from '../images/workTogetherFooter.png';

const imgErrorString = 'Image not found';

const Footer = () => {
    return (
        <div className={styles.FooterContainer}>
            <div className={styles.HeadersContainer}>
                <img src={logo} alt={imgErrorString} className={styles.Logo}/>
                <div className={styles.Headers}>
                    <p style={{fontSize: 24, fontWeight: "bold"}}>Бездомні в безпеці</p>
                    <p style={{fontSize: 18, fontStyle: "italic"}}> Спасіння тварин</p>
                </div>
            </div>
            <div className={styles.LinksContainer}>
                <div className={styles.Link}>
                    <img src={contactsImg} alt={imgErrorString}/>
                    <p>Контакти</p>
                </div>
                <div className={styles.Link}>
                    <img src={aboutImg} alt={imgErrorString}/>
                    <p>О нас</p>
                </div>
                <div className={styles.Link}>
                    <img src={workTogetherImg} alt={imgErrorString}/>
                    <p>Співпраця</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;