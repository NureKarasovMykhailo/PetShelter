import React from 'react';
import styles from './ShelterInfo.module.css';
import Button from "../UI/button/Button";
import {useNavigate} from "react-router-dom";
import {
    ADOPTION_OFFER_ROUTE,
    COLLAR_ROUTE,
    EMPLOYEES_ROUTE,
    FEEDER_ROUTE,
    PET_ROUTE,
    SHELTER_WORK_OFFER_ROUTE
} from "../../utils/const";

const ShelterInfo = ({ shelter }) => {

    const navigate = useNavigate();

    return (
        <div className={styles.shelterInfoContainer}>
            <div className={styles.shelterInfoHeader}>
                <h2>Меню притулку</h2>
            </div>
            <div className={styles.shelterInfoLine}>
                <hr className={styles.horizontalLine} />
            </div>
            <div className={styles.shelterInfoInformationContainer}>
                <div className={styles.infoContainerHeader}>
                    <h3>Інформація про притулок</h3>
                </div>
                <div className={styles.shelterDataContainer}>
                    <div className={styles.shelterImageContainer}>
                        <img
                            className={styles.shelterImage}
                            alt={"Image not found"}
                            src={process.env.REACT_APP_API_URL + shelter.shelter_image}
                        />
                    </div>
                    <div className={styles.shelterTextData}>
                        <p><b>Юридична назва:</b> {shelter.shelter_name}</p>
                        <p><b>Адреса:</b> {shelter.shelter_address}</p>
                        <p><b>Домене ім'я:</b> {shelter.shelter_domain}</p>
                    </div>
                </div>
            </div>
            <div className={styles.shelterInfoLine}>
                <hr className={styles.horizontalLine} />
            </div>
            <div className={styles.shelterInfoLinkContainer}>
                <div className={styles.shelterLinkContainerHeaders}>
                    <h3>Дані притулку</h3>
                </div>
                <div className={styles.linkColumns}>
                    <div className={styles.linkColumn}>
                        <Button
                            buttonText={"Тварини притулку"}
                            onClick={() => navigate(PET_ROUTE)}
                        />
                        <Button
                            buttonText={"Робітники притулку"}
                            onClick={() => navigate(EMPLOYEES_ROUTE)}
                        />
                        <Button
                            buttonText={"Розумні годівниці"}
                            onClick={() => navigate(FEEDER_ROUTE)}
                        />
                    </div>
                    <div className={styles.linkColumn}>
                        <Button
                            buttonText={"Оголошення про работу"}
                            onClick={() => navigate(SHELTER_WORK_OFFER_ROUTE)}

                        />
                        <Button
                            buttonText={"Оголошення про опеку"}
                            onClick={() => navigate(ADOPTION_OFFER_ROUTE)}
                        />
                        <Button
                            buttonText={"Розумні нашийники"}
                            onClick={() => navigate(COLLAR_ROUTE)}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.shelterInfoLine}>
                <hr className={styles.horizontalLine} />
            </div>

        </div>
    );
};

export default ShelterInfo;