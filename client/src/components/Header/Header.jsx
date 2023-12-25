import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import Button from "../UI/button/Button";
import Select from "../UI/select/Select";
import LinkWithIcon from "../UI/link/LinkWithIcon";
import {
    ALL_ADOPTION_OFFER_ROUTE,
    AUTH_ROUTE,
    IMAGES,
    MAIN_ROUTE,
    PROFILE_ROUTE,
    SUBSCRIBE_ROUTE,
} from "../../utils/const";
import { setupAxios } from "../../API/axiosConfig";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

const Header = observer(() => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then();
    };

    const imageAltText = t("imageNotFound");
    const { user } = useContext(Context);

    const navigate = useNavigate();
    const handleAuthBtnClick = () => {
        navigate(AUTH_ROUTE);
    };
    const handleLogoClick = () => {
        navigate(MAIN_ROUTE);
    };

    const handleProfileClick = () => {
        navigate(PROFILE_ROUTE);
    };
    const navLinks = [
        { text: t("volunteerWork"), imgSrc: IMAGES.VOLUNTARY_WORK, alt: imageAltText },
        { text: t("fostering"), imgSrc: IMAGES.PET_ADOPTION, alt: imageAltText, href: ALL_ADOPTION_OFFER_ROUTE },
        { text: t("subscription"), imgSrc: IMAGES.SUBSCRIBE, alt: imageAltText, href: SUBSCRIBE_ROUTE },
        { text: t("opportunities"), imgSrc: IMAGES.ABILITY, alt: imageAltText },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState("uk");

    useEffect(() => {
        localStorage.setItem("selectedLanguage", selectedLanguage);
        setupAxios(selectedLanguage);
        return () => {};
    }, [selectedLanguage]);

    const handleLanguageSelectorChange = (selectedLanguage) => {
        setSelectedLanguage(selectedLanguage);
        localStorage.setItem("selectedLanguage", selectedLanguage);
        changeLanguage(selectedLanguage);
    };

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerTitleRow}>
                <div className={styles.headerLogoContainer}>
                    <img
                        className={styles.headerLogo}
                        src={IMAGES.HEADER_LOGO}
                        alt={imageAltText}
                        onClick={handleLogoClick}
                    />
                    <div className={styles.headerText}>
                        <p className={styles.headerTextFirstRow}>{t("firstRowText")}</p>
                        <p className={styles.headerTextSecondRow}>{t("secondRowText")}</p>
                    </div>
                </div>
                <div className={styles.headerSettingContainer}>
                    <Select
                        options={[
                            { label: "УКР", value: "uk" },
                            { label: "ENG", value: "en" },
                        ]}
                        onChange={(selectedLanguage) => {
                            handleLanguageSelectorChange(selectedLanguage);
                        }}
                        value={selectedLanguage}
                    />
                    <div className={styles.headerLogIn}>
                        {user.isAuth ? (
                            <div className={styles.headerProfileInfoContainer}>
                                <p onClick={handleProfileClick} className={styles.headerProfileLogin}>
                                    {user.user.login}
                                </p>
                                <img
                                    className={styles.headerProfileImage}
                                    src={process.env.REACT_APP_API_URL + user.user.user_image}
                                    alt={imageAltText}
                                />
                            </div>
                        ) : (
                            <div className={styles.logInButtonContainer}>
                                <Button buttonText={t("enter")} onClick={handleAuthBtnClick} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.headerNavBar}>
                {navLinks.map((link, index) => (
                    <LinkWithIcon
                        key={index}
                        imgSrc={link.imgSrc}
                        text={link.text}
                        alt={link.alt}
                        href={link.href}
                    />
                ))}
            </div>
        </div>
    );
});

export default Header;
