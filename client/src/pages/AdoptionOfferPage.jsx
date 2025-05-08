// AdoptionOfferPage.js
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAdoptionOfferForOneShelter } from '../API/AdoptionOfferService';
import AdoptionOfferList from '../components/adoptionOffer/adoptionOfferList/AdoptionOfferList';
import '../styles/AdoptionOferPage.css';
import SearchInput from '../components/UI/input/searchInput/SearchInput';
import { Context } from '../index';
import Loader from '../components/UI/loader/Loader';
import Pagination from '../components/UI/pagination/Pagination';
import { getPagesArray } from '../utils/pagination';
import Button from '../components/UI/button/Button';
import Modal from '../components/UI/modal/Modal';
import AddAdoptionOffer from '../components/adoptionOffer/addAdoptionOffer/AddAdoptionOffer';
import { fetchPets } from '../API/PetService';

const AdoptionOfferPage = () => {
    const { t } = useTranslation();
    const [adoptionOffers, setAdoptionOffers] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(4);
    const [searchData, setSearchData] = useState();
    const [refreshAction, setRefreshAction] = useState(false);
    const [addModalActive, setAddModalActive] = useState(false);
    const [pets, setPets] = useState([{}]);
    const [success, setSuccess] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { user } = useContext(Context);

    const handleSearchClick = () => {
        fetchAdoptionOfferForOneShelter(limit, page, searchData).then((data) => {
            setAdoptionOffers(data.adoptionOffer);
            setTotalCount(data.pagination.totalItems);
            setTotalPages(data.pagination.totalPages);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchPets().then((data) => {
            setPets(data.pets);
            fetchAdoptionOfferForOneShelter(limit, page).then((data) => {
                setAdoptionOffers(data.adoptionOffer);
                setTotalCount(data.pagination.totalItems);
                setTotalPages(data.pagination.totalPages);
                setIsLoading(false);
                setRefreshAction(false);
                setAddModalActive(false);
                setSuccess(false);
                setRefresh(false);
            });
        });
    }, [page, refreshAction, success, refresh]);

    return (
        isLoading ? (
            <Loader />
        ) : (
            <div className="adoption-offer__wrapper">
                <div className="adoption-offer__search-container">
                    <div className="adoption-offer__search">
                        <p className="adoption-offer__label">{t('animalName')}:</p>
                        <SearchInput
                            data={searchData}
                            placeholder={t('animalNamePlaceholder')}
                            onChange={(searchData) => setSearchData(searchData)}
                            onClick={handleSearchClick}
                        />
                    </div>
                    <div className="adoption-offer__btn-show">
                        <Button
                            buttonText={t('showAll')}
                            onClick={() => setRefreshAction(true)}
                        />
                    </div>
                </div>
                <div className="adoption-offer__list">
                    {adoptionOffers.length !== 0 ? (
                        <AdoptionOfferList
                            adoptionOffers={adoptionOffers}
                            setRefresh={(refresh) => setRefresh(refresh)}
                        />
                    ) : (
                        <div className="adoption-offer__empty">
                            <p>{t('noAdoptionOffers')}</p>
                        </div>
                    )}
                </div>
                {(user.user.roles.includes('subscriber') || user.user.roles.includes('adoptionAdmin')) && (
                    <div className="adoption-offer__create-container">
                        <div className="adoption-offer__button">
                            <Button
                                buttonText={t('addAnnouncement')}
                                onClick={() => setAddModalActive(true)}
                            />
                        </div>
                    </div>
                )}
                <div className="adoption-offer__pagination">
                    <Pagination
                        pagesArray={getPagesArray(totalPages)}
                        currentPage={page}
                        onClick={(page) => setPage(page)}
                    />
                </div>
                <Modal
                    active={addModalActive}
                    setActive={setAddModalActive}
                >
                    <AddAdoptionOffer pets={pets} setSuccess={setSuccess} />
                </Modal>
            </div>
        )
    );
};

export default AdoptionOfferPage;
