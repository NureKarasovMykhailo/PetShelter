import React, { useContext } from 'react';
import stl from './WorkOfferItem.module.css';
import Button from '../../UI/button/Button';
import { Context } from '../../../index';
import DeleteButton from '../../UI/button/DeleteButton';
import { deleteWorkOffer } from '../../../API/WorkOfferService';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_ONE_WORK_OFFER_ROUTE, SHELTER_ONE_WORK_OFFER_ROUTE } from '../../../utils/const';
import { useTranslation } from 'react-i18next';

const WorkOfferItem = ({ workOffer, setRefresh, isPublic = false }) => {
    const shortDescription = workOffer.work_description.slice(0, 100);
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleDeleteWorkOffer = async () => {
        try {
            await deleteWorkOffer(workOffer.id);
            setRefresh(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={stl.workOfferItem}>
            <div className={stl.workOfferInfo}>
                <div className={stl.workTitle}>
                    <h3>{workOffer.work_title}</h3>
                </div>
                <div className={stl.workOfferAddress}>
                    <p>{workOffer.shelter.shelter_address}</p>
                </div>
                <div className={stl.workOfferDescription}>{shortDescription}...</div>
            </div>
            {!isPublic ? (
                <div className={stl.workOfferButtons}>
                    <div className={stl.button}>
                        <Button
                            buttonText={t('readMore')}
                            onClick={() => {
                                navigate(SHELTER_ONE_WORK_OFFER_ROUTE.replace(':id', workOffer.id));
                            }}
                        />
                    </div>
                    {user.user.roles.includes('subscriber') || user.user.roles.includes('workAdmin') ? (
                        <div className={stl.button}>
                            <DeleteButton buttonText={t('delete')} onClick={handleDeleteWorkOffer} />
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className={stl.workOfferButtons}>
                    <div className={stl.button}>
                        <Button
                            buttonText={t('readMore')}
                            onClick={() => {
                                navigate(PUBLIC_ONE_WORK_OFFER_ROUTE.replace(':id', workOffer.id));
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkOfferItem;
