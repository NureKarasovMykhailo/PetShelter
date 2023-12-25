import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';
import LinkWithIcon from '../UI/link/LinkWithIcon';
import { IMAGES } from '../../utils/const';

const Footer = () => {
    const { t } = useTranslation();

    const navLinks = [
        { text: t('contacts'), imgSrc: IMAGES.CONTACTS_ICON, alt: t('imageAltText'), href: '#' },
        { text: t('aboutUs'), imgSrc: IMAGES.ABOUT_ICON, alt: t('imageAltText'), href: '#' },
        { text: t('cooperation'), imgSrc: IMAGES.TOGETHER_ICON, alt: t('imageAltText'), href: '#' },
    ];

    return (
        <div className={styles.footerContainer}>
            <div className={styles.footer}>
                <div className={styles.footerLogoContainer}>
                    <img className={styles.footerLogo} src={IMAGES.HEADER_LOGO} alt={t('imageAltText')} />
                    <div className={styles.footerHeaders}>
                        <p className={styles.footerFirstHeader}>{t('firstHeader')}</p>
                        <p className={styles.footerSecondHeader}>{t('secondHeader')}</p>
                    </div>
                    <div className={styles.footerLinks}>
                        {navLinks.map((link, index) => (
                            <LinkWithIcon
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
};

export default Footer;
