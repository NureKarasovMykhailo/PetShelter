import React, {useEffect} from "react";
import ImageWithLink from "../components/ImageWithLink";
import Button from "../components/UI/button/Button";
import { IMAGES } from "../utils/const";
import "../styles/Main.css";
import {checkAuth, getToken} from "../API/UserService";

const Main = () => {

    const imgAltText = "image not found";

    const adoptionLinks = [
        {imgSrc: IMAGES.CAT_IMAGE, linkText: "Коти", href: "#", alt: imgAltText},
        {imgSrc: IMAGES.DOG_IMAGE, linkText: "Собаки", href: "#", alt: imgAltText},
        {imgSrc: IMAGES.DOG_AND_CAT_IMAGE, linkText: "Породсті коти та собаки", href: "#", alt: imgAltText},

    ];


    return (
        <div className="new-main-page-container">
            <div className="new-adoption-offer-container">
                <div className="new-adoption-offer-header">
                    <h2 className="new-adoption-offer-header__title">Заведить собі нового члена родини</h2>
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
                    <Button buttonText="Оформити опекунство" />
                </div>
            </div>

            <div className="new-work-offer-container">
                <div className="new-work-offer-image-container">
                    <img className="new-work-offer-image" src={IMAGES.WORK_OFFER_IMAGE} alt={imgAltText} />
                </div>
                <div className="new-work-offer">
                    <div className="new-work-offer-text">
                        <h2 className="new-work-offer-text__title">Їм потрібна твоя допомога</h2>
                        <p className="new-work-offer-detail">Приєднуйся до волонтерського колективу у своєму регіоні.</p>
                    </div>
                    <div className="new-work-offer-btn">
                        <Button buttonText="Волонтерьска робота у твоєму регіоні" />
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