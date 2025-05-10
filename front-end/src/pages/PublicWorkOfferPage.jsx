import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from "../components/UI/loader/Loader";
import '../styles/PublicWorkOfferPage.css';
import { fetchAllWorkOffers } from "../API/WorkOfferService";
import WorkOfferList from "../components/workOffer/workOfferList/WorkOfferList";
import Pagination from "../components/UI/pagination/Pagination";
import { getPagesArray } from "../utils/pagination";
import SearchInput from "../components/UI/input/searchInput/SearchInput";

const PublicWorkOfferPage = () => {
    const { t } = useTranslation();
    const [workOffers, setWorkOffers] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [address, setAddress] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetchAllWorkOffers(limit, page).then(data => {
            setWorkOffers(data.workOffers);
            setPage(data.pagination.currentPage);
            setTotalPages(data.pagination.totalPages);
            setIsLoading(false);
        });
    }, [page]);

    const handleSearchByTitle = async () => {
        try {
            fetchAllWorkOffers(limit, page, '', '', title).then(data => {
                setWorkOffers(data.workOffers);
                setPage(data.pagination.currentPage);
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

            fetchAllWorkOffers(limit, page, country, city, '').then(data => {
                setWorkOffers(data.workOffers);
                setPage(data.pagination.currentPage);
                setTotalPages(data.pagination.totalPages);
                setIsLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        isLoading
            ?
            <div className={"public-work__wrapper"}>
                <Loader />
            </div>
            :
            <div className={"public-work__wrapper"}>
                <div className="public-work__search-container">
                    <div className="public-work__search">
                        <p>{t('addressLabel')}: </p>
                        <SearchInput
                            placeholder={t('addressPlaceholder')}
                            data={address}
                            onChange={setAddress}
                            onClick={handleSearchByAddress}
                        />
                    </div>
                    <div className="public-work__search">
                        <p>{t('titleLabel')}: </p>
                        <SearchInput
                            placeholder={t('titlePlaceholder')}
                            data={title}
                            onChange={setTitle}
                            onClick={handleSearchByTitle}
                        />
                    </div>
                </div>
                {workOffers.length !== 0
                    ?
                    <WorkOfferList
                        workOffers={workOffers}
                        isPublic={true}
                    />
                    :
                    <div className={"public-work__empty"}>
                        <p>{t('noWorkOffers')}</p>
                    </div>
                }
                <div className="public-work__pagination">
                    <Pagination
                        currentPage={page}
                        pagesArray={getPagesArray(totalPages)}
                        onClick={(page) => setPage(page)}
                    />
                </div>
            </div>
    );
};

export default PublicWorkOfferPage;
