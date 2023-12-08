import React from "react";
import styles from "./Header.module.css";
import Button from "../UI/button/Button";
import Select from "../UI/select/Select";
import Link from "../UI/link/Link";
import {IMAGES} from "../../utils/const";

const Header = () => {

    const imageAltText = "Image not found";

    const handleSelectChange = (e) => {
        console.log(e.target.value);
    };      

    const navLinks = [
        {  text: "Волонтерьска робота", imgSrc: IMAGES.VOLUNTARY_WORK, alt: imageAltText},
        {  text: "Опекунство", imgSrc: IMAGES.PET_ADOPTION, alt: imageAltText},
        {  text: "Підписка", imgSrc: IMAGES.SUBSCRIBE, alt: imageAltText},
        {  text: "Можливості", imgSrc: IMAGES.ABILITY, alt: imageAltText},
    ];

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerTitleRow}>
                <div className={styles.headerLogoContainer}>
                    <img className={styles.headerLogo} src={IMAGES.HEADER_LOGO} alt={imageAltText} />
                    <div className={styles.headerText}>
                        <p className={styles.headerTextFirstRow}>Бездомні в безпеці</p>
                        <p className={styles.headerTextSecondRow}>Спасіння тварин</p>
                    </div>
                </div>
                <div className={styles.headerSettingContainer}>
                    <Select 
                        options={[
                            {label: "УКР", value: "ukraine"},
                            {label: "ENG", value: "english"},
                        ]}
                        onChange={handleSelectChange}
                    />
                    <div className={styles.headerLogIn}>
                        <Button
                            buttonText="Вхід"
                            onClick={() => {console.log("Log in button is clicked")}}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.headerNavBar}>
                {navLinks.map((link, index) => 
                    <Link
                    key={index}
                        imgSrc={link.imgSrc}
                        text={link.text}
                        alt={link.alt}
                        href="#" 
                    />
                )}
            </div>
        </div>
    );
};

export default Header;