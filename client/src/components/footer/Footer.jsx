import React from "react";
import styles from "./Footer.module.css";
import Link from "../UI/link/Link";
import { IMAGES } from "../../utils/const";

const Footer = () => {
    const imgAltText = "Image not found";

    const navLinks = [
        { text: "Контакти", imgSrc: IMAGES.CONTACTS_ICON, alt: {imgAltText}, href: "#"},
        { text: "О нас", imgSrc: IMAGES.ABOUT_ICON, alt: {imgAltText}, href: "#"},
        { text: "Співпраця", imgSrc: IMAGES.TOGETHER_ICON, alt: {imgAltText}, href: "#"},

    ]

    return (
        <div className={styles.footerContainer}>
            <div className={styles.footer}>
                <div className={styles.footerLogoContainer}>
                    <img className={styles.footerLogo} src={IMAGES.HEADER_LOGO} alt="Image not found" />
                    <div className={styles.footerHeaders}>
                        <p className={styles.footerFirstHeader}>Бездомні в безпеці</p>
                        <p className={styles.footerSecondHeader}>Спасіння тварин</p>
                    </div>
                <div className={styles.footerLinks}>
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                text={link.text}
                                imgSrc={link.imgSrc}
                                href={link.href}
                                alt={link.alt}
                            />
                        ))}
                </div>
            </div>
        </div>
        </div>
    );
}

export default Footer;