import React, { useContext, useEffect, useState } from 'react';
import { fetchShelterWorkOffers } from "../API/WorkOfferService";
import { useTranslation } from 'react-i18next';
import Loader from "../components/UI/loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";
import { getPagesArray } from "../utils/pagination";
import '../styles/ShelterWorkOffesPage.css';
import WorkOfferList from "../components/workOffer/workOfferList/WorkOfferList";
import SearchInput from "../components/UI/input/searchInput/SearchInput";
import { Context } from "../index";
import Button from "../components/UI/button/Button";
import Modal from "../components/UI/modal/Modal";
import AddWorkOfferForm from "../components/workOffer/addWorkOfferForm/AddWorkOfferForm";

const ShelterWorkOffersPage = () => {
    const { t } = useTranslation();
    const { user } = useContext(Context);

    const [isLoading, setIsLoading] = useState(true);
    const [workOffers, setWorkOffers] = useState([{}]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(4);
    const [search, setSearch] = useState('');
    const [addModalActive, setAddModalActive] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchShelterWorkOffers(limit, page).then(data => {
            setWorkOffers(data.workOffers);
            setPage(data.pagination.currentPage);
            setTotalPages(data.pagination.totalPages);
            setIsLoading(false);
            setAddModalActive(false);
            setRefresh(false);
        });
    }, [page, refresh]);

    const handleSearch = async () => {
        try {
            fetchShelterWorkOffers(limit, page, search).then(data => {
                setWorkOffers(data.workOffers);
                setPage(data.pagination.currentPage);
                setTotalPages(data.pagination.totalPages);
                setAddModalActive(false);
                setIsLoading(false);
                setRefresh(false);
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        isLoading
            ?
            <div className={"work-offers__wrapper"}>
                <Loader />
            </div>
            :
            <div className={"work-offers__wrapper"}>
                <div className="work-offer__search-container">
                    <div className="work-offer__search">
                        <p>{t("jobTitle")}: </p>
                        <SearchInput
                            placeholder={t("jobTitlePlaceholder")}
                            data={search}
                            onChange={setSearch}
                            onClick={handleSearch}
                        />
                    </div>
                </div>
                {workOffers.length === 0
                    ?
                    <div className={"work-offer__empty"}>
                        <p>{t("noJobOffers")}</p>
                    </div>
                    :
                    <div className="work-offer__list">
                        <WorkOfferList
                            workOffers={workOffers}
                            setRefresh={(refresh) => setRefresh(refresh)}
                        />
                    </div>

                }
                {(user.user.roles.includes('subscriber') || user.user.roles.includes('workAdmin'))
                    &&
                    <div className={"work-offer__add-container"}>
                        <div className="work-offer__button">
                            <Button
                                buttonText={t("addJobOffer")}
                                onClick={() => setAddModalActive(true)}
                            />
                        </div>
                    </div>
                }
                <div className="work-offer__pagination">
                    <Pagination
                        pagesArray={getPagesArray(totalPages)}
                        currentPage={page}
                        onClick={(newPage) => setPage(newPage)}
                    />
                </div>
                <Modal
                    active={addModalActive}
                    setActive={setAddModalActive}
                >
                    <AddWorkOfferForm
                        setRefresh={(info) => setRefresh(info)}
                    />
                </Modal>
            </div>
    );
};

export default ShelterWorkOffersPage;
