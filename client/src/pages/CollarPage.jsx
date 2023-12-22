import React, {useContext, useEffect, useState} from 'react';
import '../styles/CollarPage.css';
import {fetchCollars} from "../API/CollarService";
import Loader from "../components/UI/loader/Loader";
import CollarList from "../components/collar/collarList/CollarList";
import Button from "../components/UI/button/Button";
import {Context} from "../index";
import Modal from "../components/UI/modal/Modal";
import AddCollarForm from "../components/collar/addCollarForm/AddCollarForm";
import Pagination from "../components/UI/pagination/Pagination";
import {getPagesArray} from "../utils/pagination";

const CollarPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [collars, setCollars] = useState([{}]);
    const [isAddModalActive, setIsAddModalActive] = useState(false);
    const [isAddSuccess, setIsAddSuccess] = useState(false);
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(4);
    const { user } = useContext(Context);

    useEffect(() => {
        setIsLoading(true);
        fetchCollars(limit, page).then(data => {
            setCollars(data.collars);
            setTotalCount(data.pagination.totalItems)
            setTotalPages(data.pagination.totalPages)
        })
        setIsLoading(false);
        setIsAddSuccess(false);
        setIsAddModalActive(false);
        setIsUpdateSuccess(false);
    }, [isAddSuccess, isUpdateSuccess, page]);

    return (
       isLoading
        ?
        <Loader />
           :
        <div className={"collar-page__wrapper"}>
            <div className="collar-page__list">
                <CollarList collars={collars} setOnSuccess={(success) => setIsUpdateSuccess(success)}/>
            </div>
            {(user.user.roles.includes('subscriber') || user.user.roles.includes('petAdmin'))
                &&
                <div className={"collar-page__add"}>
                    <div className="collar-page__add-button">
                        <Button
                            buttonText={"Додати нашийник"}
                            onClick={() => setIsAddModalActive(true)}
                        />
                    </div>
                </div>
            }
            <div className="feeder-wrapper__pagination-container">
                <Pagination
                    pagesArray={getPagesArray(totalPages)}
                    currentPage={page}
                    onClick={(newPage) => setPage(newPage)}
                />
            </div>
            <Modal
                active={isAddModalActive}
                setActive={setIsAddModalActive}
            >
                <AddCollarForm
                    setAddSuccess={setIsAddSuccess}
                />
            </Modal>
        </div>
    );
};

export default CollarPage;