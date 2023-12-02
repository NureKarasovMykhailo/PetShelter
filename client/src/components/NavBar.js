import React from 'react';
import styles from '../styles/NavBar.module.css';
import logo from '../images/logo.png';
import workLinkNavBer from '../images/work_link_navbar.png';
import petAdoptionLinkNavBar from '../images/petAdoptionLinkNavBar.png';
import possibilitiesLinkNavBar from '../images/possibilitiesLinkNavBar.png';
import  subscribeLinkNavBar from '../images/subscribeLinkNavBar.png'

const imgErrorText = "Image not found";

const NavBar = () => {
    return (
        <div className={styles.NavBarContainer}>
            <div className={styles.NavBarAuthRow}>
                <div className={styles.NavBarHeader}>
                    <img src={logo} className={styles.NavBarLogo} alt={imgErrorText}/>
                    <div className={styles.NavBarHeadersTexts}>
                        <p style={{fontSize: 32, fontWeight: "bold"}}>Бездомні в безпеці</p>
                        <p style={{fontSize: 24, fontStyle: "italic"}}>Спасіння тварин</p>
                    </div>
                </div>
                <div className={styles.NavBarRightSection }>
                    <div className={styles.NavBarLanguageContainer}>
                        <select className={styles.NavBarLanguageSelector} id="language" value={'#'} onChange={'#'}>
                            <option value="en">English</option>
                            <option value="ua">Українська</option>
                        </select>
                    </div>
                    <div>
                        <p style={{fontSize: 24, cursor: "pointer"}}>Вхід</p>
                    </div>
                </div>
            </div>

            <div className={styles.NavBarRoutesContainer}>
                <div className={styles.NavBarLinkContainer}>
                    <img src={workLinkNavBer} className={styles.NavBarLink} alt={imgErrorText}/>
                    <p>Волонтерська робота</p>
                </div>

                <div className={styles.NavBarLinkContainer}>
                    <img src={petAdoptionLinkNavBar} className={styles.NavBarLink} alt={imgErrorText}/>
                    <p>Усиновлення</p>
                </div>

                <div className={styles.NavBarLinkContainer}>
                    <img src={subscribeLinkNavBar} className={styles.NavBarLink} alt={imgErrorText}/>
                    <p>Підписка</p>
                </div>

                <div className={styles.NavBarLinkContainer}>
                    <img src={possibilitiesLinkNavBar} className={styles.NavBarLink} alt={imgErrorText}/>
                    <p>Можливості</p>
                </div>
            </div>
        </div>
    );
};

export default NavBar;