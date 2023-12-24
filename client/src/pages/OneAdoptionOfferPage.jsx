import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Loader from "../components/UI/loader/Loader";
import {fetchOneAdoptionOffer} from "../API/AdoptionOfferService";
import {fetchOnePet, fetchPets} from "../API/PetService";
import {getShelter} from "../API/ShelterService";
import '../styles/OneAdoptionOfferPage.css';
import Button from "../components/UI/button/Button";
import Modal from "../components/UI/modal/Modal";
import AdoptionOfferUpdate from "../components/adoptionOffer/adoptionOfferUpdate/AdoptionOfferUpdate";
import {Context} from "../index";
import {APPLICATION_FOR_ADOPTION_PAGE} from "../utils/const";

const OneAdoptionOfferPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(Context);
    const [adoptionOffer, setAdoptionOffer] = useState({});
    const [pet, setPet] = useState({});
    const [petInfo, setPetInfo] = useState([{}]);
    const [shelter, setShelter] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [editModalActive, setEditModalActive] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchOneAdoptionOffer(id).then(adoptionOfferData => {
            setAdoptionOffer(adoptionOfferData);
            fetchOnePet(adoptionOfferData.petId).then(petData => {
                setPet(petData);
                setPetInfo(petData.pet_characteristics);
                getShelter(petData.shelterId).then(shelterData => {
                    setShelter(shelterData.data);
                    setIsLoading(false);
                    setEditModalActive(false);
                    setRefresh(false);
                });
            });
        });
    }, [id, refresh]);


    return (
        isLoading
            ?
            <div className={"one-adoption-offer__wrapper"}>
                <Loader />
            </div>
            :
            <div className={"one-adoption-offer__wrapper"}>
                <div className="one-adoption-offer__pet-offer pet-offer">
                    <div className={"pet-offer_image-container"}>
                        <img
                            src={process.env.REACT_APP_API_URL + pet.pet_image}
                            alt={"Image not found"}
                            className={"pet-offer__image"}
                        />
                    </div>
                    <div className={"pet-offer__info-container"}>
                        <div className="pet-offer__header">
                            <h3>Інформація: </h3>
                        </div>
                        <p>Кличка: {pet.pet_name}</p>
                        <p>Вік: {pet.pet_age}</p>
                        <p>Стать: {pet.pet_gender}</p>
                        <p>Вид: {pet.pet_kind}</p>
                        {petInfo && petInfo.map(info =>
                            <p>{info.title}: {info.description}</p>
                        )}
                    </div>
                </div>
                <div className={"one-adoption-offer__line-container"}>
                    <hr className={"one-adoption-offer__line-container"}/>
                </div>
                <div className={"one-adoption-offer__adoption-info"}>
                    <p>Адреса: {shelter.shelter_address}</p>
                    <p>Притулок: {shelter.shelter_name}</p>
                    <p>Ціна усивновлення: {adoptionOffer.adoption_price}</p>
                    <p>Контактний email: {adoptionOffer.adoption_email}</p>
                    <p>Контактний номер телефону: {adoptionOffer.adoption_telephone}</p>
                </div>
                <div className="one-adoption-offer_info">
                    <p>Додаткова інформація: </p>
                    <p>{adoptionOffer.adoption_info}</p>
                </div>
                <div className={"one-adoption-offer__buttons"}>
                    {(user.user.roles.includes('subscriber') || user.user.roles.includes('adoptionAdmin'))
                        &&
                        <div className="one-adoption-offer__btn">
                            <Button
                                buttonText={"Редагувати"}
                                onClick={() => setEditModalActive(true)}
                            />
                        </div>
                    }
                    <div className="one-adoption-offer__btn">
                        <Button
                            buttonText={"Заявки на опекунство"}
                            onClick={() => {
                                navigate(APPLICATION_FOR_ADOPTION_PAGE.replace(':id', id))
                            }}
                        />
                    </div>
                </div>
                <Modal
                    setActive={setEditModalActive}
                    active={editModalActive}
                >
                    <AdoptionOfferUpdate
                        adoptionOffer={adoptionOffer}
                        setRefresh={(refresh) => setRefresh(refresh)}
                    />
                </Modal>
            </div>
    );
};

export default OneAdoptionOfferPage;