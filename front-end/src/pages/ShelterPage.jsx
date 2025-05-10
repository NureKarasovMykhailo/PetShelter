import React, { useContext, useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { useTranslation } from 'react-i18next';
import '../styles/ShelterPage.css';
import Button from "../components/UI/button/Button";
import ShelterForm from "../components/shelter/ShelterForm";
import { deleteShelter, getShelter } from "../API/ShelterService";
import ShelterInfo from "../components/shelter/ShelterInfo";
import Loader from "../components/UI/loader/Loader";
import UnderlineLink from "../components/UI/link/underlineLink/UnderlineLink";
import { IMAGES, PROFILE_ROUTE } from "../utils/const";
import { useNavigate } from "react-router-dom";
import UpdateShelterForm from "../components/shelter/UpdateShelterForm";

const ShelterPage = observer(() => {
    const { t } = useTranslation();
    const { user, shelter } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [shelterInfo, setShelterInfo] = useState({})
    const [updateModalActive, setUpdateModalActive] = useState(false);
    const [addModalActive, setAddModalActive] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShelterData = async () => {
            try {
                const response = await getShelter(user.user.shelterId);
                return response;
            } catch (error) {
                console.log(error)
            }
        }

        if (user.user.shelterId) {
            fetchShelterData().then(response => {
                shelter.setShelter(response.data);
                setShelterInfo(shelter.getShelter())
                setIsLoading(false)
            });
        } else {
            setIsLoading(false)
        }
    }, []);

    const handleDeleteShelterClick = async () => {
        try {
            setIsLoading(true)
            const response = await deleteShelter();
            localStorage.setItem('token', response.data.token)
            navigate(PROFILE_ROUTE);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        isLoading ? (
            <Loader />
        ) : (
            <div className="shelter-wrapper">
                {user.user.shelterId ? (
                    <div className="shelter-wrapper__container shelter-container">
                        <ShelterInfo
                            shelter={shelter.getShelter()}
                        />
                        <div className="shelter-container__control-button-container">
                            <h3>{t("shelterManagement")}</h3>
                            <div className="shelter-container__control-button">
                                <UnderlineLink
                                    linkText={t("updateShelter")}
                                    imgSrc={IMAGES.UPDATE_ICON}
                                    onClick={() => setUpdateModalActive(true)}
                                />
                                <UnderlineLink
                                    linkText={t("deleteShelter")}
                                    imgSrc={IMAGES.DELETE_ICON}
                                    onClick={handleDeleteShelterClick}
                                />
                            </div>
                        </div>
                        <UpdateShelterForm
                            updateModalActive={updateModalActive}
                            setUpdateModalActive={setUpdateModalActive}
                            shelter={shelterInfo}
                            subscriberDomain={user.user.domai_email}
                        />
                    </div>
                ) : (
                    <div className="shelter-wrapper__container shelter-container">
                        <div className="shelter-container__label">
                            <p>{t("noShelterMessage")}</p>
                        </div>
                        <div className="shelter-container__add-shelter-button">
                            <Button
                                buttonText={t("addShelter")}
                                onClick={() => setAddModalActive(true)}
                            />
                        </div>
                    </div>
                )}
                <ShelterForm
                    addModalActive={addModalActive}
                    setAddModalActive={setAddModalActive}
                />
            </div>
        )
    );
});

export default ShelterPage;
