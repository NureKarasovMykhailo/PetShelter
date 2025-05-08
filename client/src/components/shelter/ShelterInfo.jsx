import React from 'react';
import styles from './ShelterInfo.module.css';
import Button from '../UI/button/Button';
import { useNavigate } from 'react-router-dom';
import {
    ADOPTION_OFFER_ROUTE,
    COLLAR_ROUTE,
    EMPLOYEES_ROUTE,
    FEEDER_ROUTE,
    PET_ROUTE,
    SHELTER_WORK_OFFER_ROUTE,
} from '../../utils/const';
import { useTranslation } from 'react-i18next';

const ShelterInfo = ({ shelter }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className={styles.shelterInfoContainer}>
            <div className={styles.shelterInfoHeader}>
                <h2>{t('shelterMenu')}</h2>
            </div>
            <div className={styles.shelterInfoLine}>
                <hr className={styles.horizontalLine} />
            </div>
            <div className={styles.shelterInfoInformationContainer}>
                <div className={styles.infoContainerHeader}>
                    <h3>{t('shelterData')}</h3>
                </div>
                <div className={styles.shelterDataContainer}>
                    <div className={styles.shelterImageContainer}>
                        <img
                            className={styles.shelterImage}
                            alt="Image not found"
                            src={process.env.REACT_APP_API_URL + shelter.shelter_image}
                        />
                    </div>
                    <div className={styles.shelterTextData}>
                        <p>
                            <b>{t('legalName')}:</b> {shelter.shelter_name}
                        </p>
                        <p>
                            <b>{t('address')}:</b> {shelter.shelter_address}
                        </p>
                        <p>
                            <b>{t('domainName')}:</b> {shelter.shelter_domain}
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.shelterInfoLine}>
                <hr className={styles.horizontalLine} />
            </div>
            <div className={styles.shelterInfoLinkContainer}>
                <div className={styles.shelterLinkContainerHeaders}>
                    <h3>{t('shelterData')}</h3>
                </div>
                <div className={styles.linkColumns}>
                    <div className={styles.linkColumn}>
                        <Button
                            buttonText={t('shelterPets')}
                            onClick={() => navigate(PET_ROUTE)}
                        />
                        <Button
                            buttonText={t('shelterEmployees')}
                            onClick={() => navigate(EMPLOYEES_ROUTE)}
                        />
                        <Button
                            buttonText={t('shelterFeeders')}
                            onClick={() => navigate(FEEDER_ROUTE)}
                        />
                    </div>
                    <div className={styles.linkColumn}>
                        <Button
                            buttonText={t('jobOffers')}
                            onClick={() => navigate(SHELTER_WORK_OFFER_ROUTE)}
                        />
                        <Button
                            buttonText={t('adoptionOffers')}
                            onClick={() => navigate(ADOPTION_OFFER_ROUTE)}
                        />
                        <Button
                            buttonText={t('smartCollars')}
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
