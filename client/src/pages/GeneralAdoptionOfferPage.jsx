import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {fetchOneAdoptionOffer} from "../API/AdoptionOfferService";
import Loader from "../components/UI/loader/Loader";
import '../styles/GeneralAdoptionOfferPage.css';
import Button from "../components/UI/button/Button";
import Modal from "../components/UI/modal/Modal";
import AddApplicationForAdoption
    from "../components/applicationForAdoption/addApplicationForAdoption/AddApplicationForAdoption";

const GeneralAdoptionOfferPage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [adoptionOffer, setAdoptionOffer] = useState({});
    const [modalActive, setModalActive] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchOneAdoptionOffer(id).then(data => {
            setAdoptionOffer(data);
            setIsLoading(false);
        });
    }, []);

    return (
        isLoading
            ?
            <div className={"general-adoption__wrapper general-adoption"}>
                <Loader />
            </div>
            :
            <div className={"general-adoption__wrapper general-adoption"}>
                <div className="general-adoption__pet-info">
                    <div className="general-adoption__image-container">
                        <img
                            src={process.env.REACT_APP_API_URL + adoptionOffer.pet.pet_image}
                            alt={'Image not found'}
                            className={"general-adoption__image"}
                        />
                    </div>
                    <div className="general-adoption__info">
                        <div className="general-adoption__header">
                            <h3>Інформація: </h3>
                        </div>
                        <div className="general-adoption__information">
                            <p>Кличка: {adoptionOffer.pet.pet_name}</p>
                            <p>Вік: {adoptionOffer.pet.pet_age}</p>
                            <p>Стать: {adoptionOffer.pet.pet_gender}</p>
                            <p>Вид: {adoptionOffer.pet.pet_kind}</p>
                            {adoptionOffer.pet.pet_characteristics &&
                                adoptionOffer.pet.pet_characteristics.map(info =>
                                <p>{info.title}: {info.description}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="general-adoption__line">
                    <hr />
                </div>
                <div className="general-adoption__adoption-info-container">
                    <p>Адреса: {adoptionOffer.pet.shelter.shelter_address}</p>
                    <p>Притулок: {adoptionOffer.pet.shelter.shelter_name}</p>
                    <p>Ціна усивновлення: {adoptionOffer.adoption_price}</p>
                    <p>Контактний email: {adoptionOffer.adoption_email}</p>
                    <p>Контактний номер телефону: {adoptionOffer.adoption_telephone}</p>
                </div>
                <div className="general-adoption__additional-info-container">
                    <p>Додаткова інформація: </p>
                    <p>{adoptionOffer.adoption_info}</p>
                </div>
                <div className="general-adoption__create-application-btn">
                    <div className="general-adoption__btn">
                        <Button
                            buttonText={"Відправити заявку для оформлення опеки"}
                            onClick={() => setModalActive(true)}
                        />
                    </div>
                </div>
                <Modal
                    active={modalActive}
                    setActive={setModalActive}
                >
                    <AddApplicationForAdoption adoptionOffer={adoptionOffer}/>
                </Modal>
            </div>
    );
};

export default GeneralAdoptionOfferPage;