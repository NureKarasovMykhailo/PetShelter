import React from "react";
import ImageWithLink from "../components/ImageWithLink";
import Button from "../components/UI/button/Button";
import { IMAGES } from "../utils/const";
import "../styles/Main.css";

const Main = () => {

    const imgAltText = "image not found";

    const adoptionLinks = [
        {imgSrc: IMAGES.CAT_IMAGE, linkText: "Коти", href: "#", alt: imgAltText},
        {imgSrc: IMAGES.DOG_IMAGE, linkText: "Собаки", href: "#", alt: imgAltText},
        {imgSrc: IMAGES.DOG_AND_CAT_IMAGE, linkText: "Породсті коти та собаки", href: "#", alt: imgAltText},

    ];

    return (
        <div className="mainPageContainer">
            <div className="adoptionOfferContainer">
                <div className="adoptionOfferHeader">
                    <h2>Заведить собі нового члена родини</h2>
                </div>
                <div className="adoptionOfferLinksContainer">
                    {adoptionLinks.map((link, index) => 
                        <ImageWithLink
                            key={index}
                            imgSrc={link.imgSrc}
                            href={link.href}
                            linkText={link.linkText}
                            alt={link.alt}
                        />
                    )}
                </div>
                <div className="adoptionOfferBtn">
                    <Button
                        buttonText="Оформити опекунство"
                        
                    />
                </div>
            </div>

            <div className="workOfferContainer">
                <div className="workOfferImageContainer">
                    <img className="workOfferImage" src={IMAGES.WORK_OFFER_IMAGE} alt={imgAltText} />        
                </div>
                <div className="workOffer">
                        <div className="workOfferText">
                            <h2>Їм потрібна твоя допомога</h2>
                            <p className="workOfferDetail">Приєднуйся до волонтерського колективу у своєму регіоні.</p>
                        </div>
                        <div className="workOfferBtn">
                            <Button
                                buttonText="Волонтерьска робота у твоєму регіоні"
                            />
                        </div>
                </div>
            </div>

            <div className="mainImage">
                <img src={IMAGES.MAIN_PAGE_IMAGE} alt={imgAltText} />
            </div>
        </div>
    );
};

export default Main;