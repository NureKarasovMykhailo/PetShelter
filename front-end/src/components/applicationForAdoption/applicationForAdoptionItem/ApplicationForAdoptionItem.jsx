// ApplicationForAdoptionItem.jsx

import React, { useContext } from 'react';
import stl from './ApplicationForAdoptionItem.module.css';
import { Context } from "../../../index";
import Button from "../../UI/button/Button";
import DeleteButton from "../../UI/button/DeleteButton";
import { approvedApplication, deleteApplication } from "../../../API/ApplicationForAdoptionService";
import { useTranslation } from "react-i18next";

const ApplicationForAdoptionItem = ({ applicationForAdoption, setRefresh }) => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const handleApprovedApplication = async () => {
        try {
            await approvedApplication(applicationForAdoption.id);
            setRefresh(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteApplication = async () => {
        try {
            await deleteApplication(applicationForAdoption.id);
            setRefresh(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={stl.applicationItem}>
            <div className={stl.applicationImageContainer}>
                <img
                    src={process.env.REACT_APP_API_URL + applicationForAdoption.user.user_image}
                    alt={t("imageNotFound")}
                    className={stl.applicationImage}
                />
            </div>
            <div className={stl.applicationInfo}>
                <p>Email: {applicationForAdoption.user.email}</p>
                <p>{t("fullNameLabel")}: {applicationForAdoption.user.full_name}</p>
                <p>{t("phoneNumberLabel")}: {applicationForAdoption.user.phone_number}</p>
                <p>{t("addressLabel")}: {applicationForAdoption.application_address}</p>
            </div>
            {(user.user.roles.includes('subscriber') || user.user.roles.includes('adoptionAdmin'))
                &&
                <div className={stl.buttonsContainer}>
                    { !applicationForAdoption.is_application_approved
                        ?
                        <div className={stl.button}>
                            <Button
                                buttonText={t("approve")}
                                onClick={handleApprovedApplication}
                            />
                        </div>
                        :
                        <div className={stl.approved}>
                            <p>{t("applicationApprovedMessage")}</p>
                        </div>
                    }
                    <div className={stl.button}>
                        <DeleteButton
                            buttonText={t("delete")}
                            onClick={handleDeleteApplication}
                        />
                    </div>
                </div>
            }
        </div>
    );
};

export default ApplicationForAdoptionItem;
