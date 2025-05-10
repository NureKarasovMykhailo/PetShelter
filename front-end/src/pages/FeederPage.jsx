import React, { useContext, useEffect, useState } from 'react';
import '../styles/FeederPage.css';
import Button from "../components/UI/button/Button";
import Modal from "../components/UI/modal/Modal";
import AddFeederForm from "../components/feeder/addFeederForm/AddFeederForm";
import { observer } from "mobx-react-lite";
import { fetchFeeder } from "../API/FeederService";
import { Context } from "../index";
import FeederList from "../components/feeder/feederList/FeederList";
import Loader from "../components/UI/loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";
import { getPagesArray } from "../utils/pagination";
import {useTranslation} from "react-i18next";

const FeederPage = observer(() => {
    const [addModalActive, setAddModalActive] = useState(false);
    const [addFeederSucceed, setAddFeederSucceed] = useState(false);
    const [successDelete, setSuccessDelete] = useState(false);
    const [successUpdate, setSuccessUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(4);
    const { feeder, user } = useContext(Context);
    const { t} = useTranslation();

    const onSucceedFeederAdd = (succeed) => {
        setAddFeederSucceed(succeed);
        setAddModalActive(false);
    };

    const onSuccessDelete = (succeed) => {
        setSuccessDelete(succeed);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchFeeder(limit, page).then(data => {
            feeder.setFeeder(data.feeders);
            setTotalCount(data.pagination.totalItems);
            setTotalPages(data.pagination.totalPages);
            setIsLoading(false);
        });
        setAddFeederSucceed(false);
        setSuccessDelete(false);
        setSuccessUpdate(false);
    }, [addFeederSucceed, successDelete, successUpdate, page]);

    return (
        isLoading ? (
            <Loader />
        ) : (
            <div className={"feeder-wrapper"}>
                <div className="feeder-wrapper__list-container">
                    <FeederList
                        feeders={feeder.getFeeder()} user={user.user}
                        onSuccessDelete={onSuccessDelete}
                        onSuccessUpdate={(successUpdate) => setSuccessUpdate(successUpdate)}
                    />
                </div>
                <div className="feeder-wrapper__add-container">
                    <div className="feeder-wrapper__add-btn">
                        <Button
                            buttonText={t('addFeederButton')}
                            onClick={() => setAddModalActive(true)}
                        />
                    </div>
                </div>
                <div className="feeder-wrapper__pagination-container">
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
                    <AddFeederForm onSucceedAdd={onSucceedFeederAdd} />
                </Modal>
            </div>
        )
    );
});

export default FeederPage;
