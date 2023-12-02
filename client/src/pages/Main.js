import React from 'react';
import styles from '../styles/MainPage.module.css';
import ImageWithCaption from "../components/ImageWithCaption";
import catImage from '../images/catMainPageImg.png';
import dogImage from '../images/dogMainPageImg.png';
import dogAndCateImage from '../images/dogAndCatMainPageImg.png'
import Link from "../components/Link";
import WorkOfferImg from '../images/mainPageWorkOfferImg.png';
import dogAndCatLogo from '../images/dogAndCatImg.png';

const Main = () => {
    return (
        <div className={styles.MainPageContainer}>
            <div className={styles.MainPageAdoptionOfferContainer}>
                <h2>Заведіть собі нового члена родини</h2>
                <div className={styles.MainPageAdoptionOfferLinks}>
                        <ImageWithCaption
                            image={catImage}
                            caption="Коти"
                        />
                        <ImageWithCaption
                            image={dogImage}
                            caption="Собаки"
                        />
                        <ImageWithCaption
                            image={dogAndCateImage}
                            caption="Породисті тварини"
                        />
                </div>
                <Link
                    linkText="Оформити усиновлення"
                />
            </div>

            <div className={styles.MainPageWorkOfferContainer}>
                <div>
                    <img className={styles.MainPageWorkOfferImg} src={WorkOfferImg} alt={'Image not found'}/>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <h2 style={{fontSize: 24}}>Їм потрібна твоя допомога</h2>
                    <p style={{fontSize: 18}}>Приєднуйся до волонтерського</p>
                    <p style={{fontSize: 18}}>колективу у своєму регіоні.</p>
                    <Link
                        linkText="Волонтерська робота у твоєму регіоні"
                    />
                </div>
            </div>

            <div style={{paddingTop: 50, paddingBottom: 50, paddingLeft: 5}}>
                <img  src={dogAndCatLogo} alt={'Image not found'}/>
            </div>

        </div>

    );
};

export default Main;