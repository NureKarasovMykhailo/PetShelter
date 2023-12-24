import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Loader from "../components/UI/loader/Loader";
import '../styles/ShelterOneWorkOfferPage.css'
import {fetchOneWorkOffer} from "../API/WorkOfferService";
import SingleWorkOffer from "../components/workOffer/singleWorkOffer/SingleWorkOffer";
import Button from "../components/UI/button/Button";
import {Context} from "../index";
import Modal from "../components/UI/modal/Modal";
import UpdateWorkOfferForm from "../components/workOffer/updateWorkOfferForm/UpdateWorkOfferForm";
import {set} from "mobx";

const ShelterOneWorkOfferPage = () => {
    const { id } = useParams();
    const { user } = useContext(Context);

    const [workOffer, setWorkOffer] = useState({});
    const [updateModalActive, setUpdateModalActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchOneWorkOffer(id).then(data => {
            setWorkOffer(data.message);
            setIsLoading(false);
            setUpdateModalActive(false);
            setRefresh(false);
        });
    }, [refresh]);

    return (
        isLoading
            ?
            <div className={"shelter-work__wrapper"}>
                <Loader />
            </div>
            :
            <div className={"shelter-work__wrapper"}>
                <SingleWorkOffer
                    workOffer={workOffer}
                />
                { (user.user.roles.includes('subscriber') || user.user.roles.includes('workAdmin'))
                    &&
                    <div className="shelter-work__button-container">
                        <div className="shelter-work__button">
                            <Button
                                buttonText={"Оновити оголошення"}
                                onClick={() => setUpdateModalActive(true)}
                            />
                        </div>
                    </div>
                }
                <Modal
                    active={updateModalActive}
                    setActive={setUpdateModalActive}
                >
                    <UpdateWorkOfferForm
                        workOffer={workOffer}
                        setRefresh={(refresh) => setRefresh(refresh)}
                    />
                </Modal>
            </div>
    );
};

export default ShelterOneWorkOfferPage;