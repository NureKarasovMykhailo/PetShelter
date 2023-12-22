import React, {useContext, useEffect, useState} from 'react';
import { useParams} from "react-router-dom";
import {fetchOnePet} from "../API/PetService";
import {Context} from "../index";
import  '../styles/OnePetInfoPage.css';
import Button from "../components/UI/button/Button";
import {observer} from "mobx-react-lite";
import Modal from "../components/UI/modal/Modal";
import UpdatePetForm from "../components/pet/updatePet/UpdatePetForm";
import {fetchFeeder, unpinFeeder} from "../API/FeederService";
import FeederInfo from "../components/pet/feederInfo/FeederInfo";
import {fetchFeederInfo} from "../API/FeederInfoService";
import Loader from "../components/UI/loader/Loader";
import {fetchCollars, unpinCollar} from "../API/CollarService";
import {fetchCollarInfo} from "../API/CollarInfoService";
import CollarInfo from "../components/pet/collarInfo/CollarInfo";

const OnePetInfoPage = observer(() => {
    const { id } = useParams();
    const { user } = useContext(Context);
    const [isFeederModalActive, setIsFeederModalActive] = useState(false);
    const [isUpdateModalActive, setUpdateModalActive] = useState(false);
    const [isSetFeederSuccess, setIsSetFeederSuccess] = useState(false);
    const [isSetCollarSuccess, setIsSetCollarSuccess] = useState(false);
    const [unpinFeederAction, setUnpinFeederAction] = useState(false)
    const [isCollarInfoActive, setIsCollarInfoActive] = useState(false);
    const [unpinCollarAction, setUnpinCollarAction] = useState(false);
    const [onUpdateSuccess, setOnUpdateSuccess] = useState(false);
    const [pet, setPet] = useState({})
    const [petInfo, setPetInfo] = useState([{}]);
    const [feeder, setFeeder] = useState([{}]);
    const [feederInfo, setFeederInfo] = useState([{}]);
    const [collars, setCollars] = useState([{}]);
    const [collarInfo, setCollarInfo] = useState([{}]);
    const [isLoad, setIsLoad] = useState(true);

    const handleSetFeeder = (success) => {
        setIsSetFeederSuccess(success);
    }
    const handleUpdateSuccess = (success) => {
        setOnUpdateSuccess(true);
        setUpdateModalActive(false);
    }

    const handleUnpinFeeder = async () => {
        try {
            await unpinFeeder(pet.feederId);
            setUnpinFeederAction(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUnpinCollar = async () => {
        try {
            const response = await unpinCollar(pet.collarId, pet.id);
            console.log(response)
            setUnpinCollarAction(true);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setIsLoad(true);
        fetchOnePet(id).then(data => {
            setPet(data);
            setPetInfo(data.pet_characteristics);
            if (data.feederId) {
                fetchFeederInfo(data.feederId).then( data => {
                    setFeederInfo(data)
                });
            }
            if (data.collarId) {
                fetchCollarInfo(data.collarId).then( data => {
                    setCollarInfo(data);
                });
            }
        });
        fetchFeeder().then(data => {
            setFeeder(data.feeders)
        });
        fetchCollars().then(data => {
            setCollars(data.collars);
        });
        setIsSetFeederSuccess(false);
        setUnpinFeederAction(false);
        setUnpinCollarAction(false);
        setIsSetCollarSuccess(false);
        setIsLoad(false);
        setOnUpdateSuccess(false);
    }, [isSetFeederSuccess, unpinFeederAction, isSetCollarSuccess, unpinCollarAction, onUpdateSuccess]);

    const handleFeederModalOpen = () => {
        setIsFeederModalActive(true);
    }

    return (
        isLoad ?
        <div>
            <Loader />
        </div>
            :
            <div className={"pet-wrapper one-pet"}>
                <div className="one-pet__first-block">
                    <div className={"one-pet__image-container"}>
                        <img
                            className={"one-pet__image"}
                            src={process.env.REACT_APP_API_URL + pet.pet_image}
                            alt={"Image not found"}
                        />
                    </div>
                    <div className={"one-pet__buttons-container"}>
                        <div className={"one-pet__button-container"}>
                            <h3>Годування</h3>
                            {pet.feederId ?
                                <div className={"one-pet__feeder-control"}>
                                    <div className={"one-pet__button"}>
                                        <Button
                                            buttonText={"Переглянути годування"}
                                            onClick={handleFeederModalOpen}
                                        />
                                    </div>
                                    <div className={"one-pet__button"}>
                                        <Button
                                            buttonText={"Відкрипіти годівницю"}
                                            onClick={handleUnpinFeeder}
                                        />
                                    </div>
                                </div>
                                :
                                <div className={"one-pet__button"}>
                                    <Button
                                        buttonText={"Закріпити годівницю"}
                                        onClick={handleFeederModalOpen}
                                    />
                                </div>
                            }
                        </div>
                        <div className={"one-pet__button-container"}>
                            <h3>Нашийник</h3>
                            <div className={"one-pet__button"}>
                                {pet.collarId ?
                                    <div className={"one-pet__feeder-control"}>
                                        <div className={"one-pet__button"}>
                                            <Button
                                                buttonText={"Переглянути стан тварини"}
                                                onClick={() => setIsCollarInfoActive(true)}
                                            />
                                        </div>
                                        <div className={"one-pet__button"}>
                                            <Button
                                                buttonText={"Відкрипіти нашийник"}
                                                onClick={handleUnpinCollar}
                                            />
                                        </div>
                                    </div>
                                    :
                                    <div className={"one-pet__button"}>
                                        <Button
                                            buttonText={"Закріпити нашийник"}
                                            onClick={() => setIsCollarInfoActive(true)}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="one-pet__second-block">
                    <div className={"one-pet__status-container"}>
                        <p>Стан: </p>
                        {pet.is_status_normal === null ? (
                            <p>НЕВІДОМО</p>
                        ) : pet.is_status_normal === true ? (
                            <p>НОРМАЛЬНИЙ</p>
                        ) : (
                            <p>ПРОБЛЕМНИЙ</p>
                        )}
                    </div>
                </div>
                <hr />
                <div className={"one-pet__third-block"}>
                    <div className="one-pet__information-container">
                        <div className="one-pet__information-header">
                            <h3>Інформація</h3>
                        </div>
                        <div className="one-pet__information">
                            <p>ID: {pet.id}</p>
                            <p>Кличка: {pet.pet_name}</p>
                            <p>Вік: {pet.pet_age}</p>
                            <p>Номер клітки: {pet.cell_number}</p>
                            <p>Стать: {pet.pet_gender}</p>
                        </div>
                    </div>
                    <div className="one-pet__characteristics-container">
                        <div className="one-pet__characteristics-header">
                            <h3>Характеристики</h3>
                        </div>
                        <div className="one-pet__characteristics">
                            {petInfo.map((characteristic, index) =>
                                <div key={index} className={"one-pet__characteristic"}>
                                    <div className="one-pet__characteristic-title">
                                        {characteristic.title}:
                                    </div>
                                    <div className="one-pet__characteristic-description">
                                        {characteristic.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {
                    ( user.user.roles.includes('subscriber')
                        || user.user.roles.includes('petAdmin'))
                    &&
                    <div className="one-pet__firth-block">
                        <div className="one-pet__edit-button">
                            <Button
                                buttonText={"Редагувати"}
                                onClick={() => setUpdateModalActive(true)}
                            />
                        </div>
                    </div>
                }
                <Modal
                    active={isUpdateModalActive}
                    setActive={setUpdateModalActive}
                >
                    <UpdatePetForm setOnUpdateSuccess={handleUpdateSuccess}/>
                </Modal>
                <Modal
                    active={isFeederModalActive}
                    setActive={setIsFeederModalActive}
                >
                    <FeederInfo
                        pet={pet}
                        feeder={feeder}
                        onSuccessSet={handleSetFeeder}
                        feederInfo={feederInfo}
                    />
                </Modal>
                <Modal
                    active={isCollarInfoActive}
                    setActive={setIsCollarInfoActive}
                >
                    <CollarInfo
                        pet={pet}
                        collars={collars}
                        collarInfo={collarInfo}
                        setSuccessSet={(success) => setIsSetCollarSuccess(success)}
                    />
                </Modal>
            </div>
    );
});

export default OnePetInfoPage;