import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Loader from '../components/UI/loader/Loader';
import { fetchAllAdoptionOffers } from '../API/AdoptionOfferService';
import '../styles/AllAdoptionOfferPage.css';
import AllAdoptionOfferList from '../components/adoptionOffer/allAdoptionOfferList/AllAdoptionOfferList';
import SearchInput from '../components/UI/input/searchInput/SearchInput';
import Pagination from '../components/UI/pagination/Pagination';
import { getPagesArray } from '../utils/pagination';

const AllAdoptionOfferPage = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [adoptionOffers, setAdoptionOffers] = useState([{}]);
    const [address, setAddress] = useState('');
    const [petName, setPetName] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAllAdoptionOffers(limit, page).then((data) => {
            setAdoptionOffers(data.adoptionOffer);
            setTotalPages(data.pagination.totalPages);
            setIsLoading(false);
        });
    }, [page]);

    const handleSearchByName = async () => {
        try {
            fetchAllAdoptionOffers(limit, page, petName).then((data) => {
                setAdoptionOffers(data.adoptionOffer);
                setTotalPages(data.pagination.totalPages);
                setIsLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchByAddress = async () => {
        try {
            const parts = address.split(' ');
            const country = parts[0];
            const city = parts[1];

            fetchAllAdoptionOffers(limit, page, '', country, city).then((data) => {
                setAdoptionOffers(data.adoptionOffer);
                setTotalPages(data.pagination.totalPages);
                setIsLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        isLoading ? (
            <div className={'all-adoption-offer__wrapper all-adoption'}>
                <Loader />
            </div>
        ) : (
            <div className={'all-adoption-offer__wrapper all-adoption'}>
                <div className="all-adoption__search-container">
                    <div className="all-adoption__search">
                        <p>{t('addressLabel')}</p>
                        <SearchInput
                            data={address}
                            onChange={(newAddress) => setAddress(newAddress)}
                            placeholder={t('placeholderAddress')}
                            onClick={handleSearchByAddress}
                        />
                    </div>
                    <div className="all-adoption__search">
                        <p>{t('nameLabel')}</p>
                        <SearchInput
                            data={petName}
                            onChange={(name) => setPetName(name)}
                            placeholder={t('placeholderName')}
                            onClick={handleSearchByName}
                        />
                    </div>
                </div>
                <div className="all-adoption-offer__list">
                    <AllAdoptionOfferList adoptionOffers={adoptionOffers} />
                </div>
                <div className={'all-adoption-offer__pagination'}>
                    <Pagination
                        pagesArray={getPagesArray(totalPages)}
                        currentPage={page}
                        onClick={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>
        )
    );
};

export default AllAdoptionOfferPage;
