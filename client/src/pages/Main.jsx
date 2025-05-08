import React from "react";
import ImageWithLink from "../components/ImageWithLink";
import Button from "../components/UI/button/Button";
import { ALL_ADOPTION_OFFER_ROUTE, IMAGES, PUBLIC_WORK_OFFER_ROUTE } from "../utils/const";
import "../styles/Main.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Main = () => {
    const { t } = useTranslation();

    const imgAltText = "image not found";

    const navigate = useNavigate();
    const adoptionLinks = [
        { imgSrc: IMAGES.CAT_IMAGE, linkText: t("catLinkText"), href: "#", alt: imgAltText },
        { imgSrc: IMAGES.DOG_IMAGE, linkText: t("dogLinkText"), href: "#", alt: imgAltText },
        { imgSrc: IMAGES.DOG_AND_CAT_IMAGE, linkText: t("dogAndCatLinkText"), href: "#", alt: imgAltText },
    ];

    return (
        <div className="new-main-page-container">
            <div className="new-adoption-offer-container">
                <div className="new-adoption-offer-header">
                    <h2 className="new-adoption-offer-header__title">{t("adoptionOfferTitle")}</h2>
                </div>
                <div className="new-adoption-offer-links-container">
                    {adoptionLinks.map((link, index) => (
                        <ImageWithLink
                            key={index}
                            imgSrc={link.imgSrc}
                            href={link.href}
                            linkText={link.linkText}
                            alt={link.alt}
                        />
                    ))}
                </div>
                <div className="new-adoption-offer-btn">
                    <Button buttonText={t("adoptionOfferButton")} onClick={() => navigate(ALL_ADOPTION_OFFER_ROUTE)} />
                </div>
            </div>

            <div className="new-work-offer-container">
                <div className="new-work-offer-image-container">
                    <img className="new-work-offer-image" src={IMAGES.WORK_OFFER_IMAGE} alt={imgAltText} />
                </div>
                <div className="new-work-offer">
                    <div className="new-work-offer-text">
                        <h2 className="new-work-offer-text__title">{t("workOfferTitle")}</h2>
                        <p className="new-work-offer-detail">{t("workOfferDetail")}</p>
                    </div>
                    <div className="new-work-offer-btn">
                        <Button buttonText={t("workOfferButton")} onClick={() => navigate(PUBLIC_WORK_OFFER_ROUTE)} />
                    </div>
                </div>
            </div>

            <div className="new-main-image">
                <img src={IMAGES.MAIN_PAGE_IMAGE} alt={imgAltText} />
            </div>
        </div>
    );
};

export default Main;
