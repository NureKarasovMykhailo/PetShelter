import React, {useEffect, useState} from 'react';
import Loader from "../components/UI/loader/Loader";
import '../styles/ApplicationForAdoptionPage.css';
import {useParams} from "react-router-dom";
import {fetchApplicationForAdoption} from "../API/ApplicationForAdoptionService";
import ApplicationForAdoptionList
    from "../components/applicationForAdoption/applicationForAdoptionList/ApplicationForAdoptionList";
import Pagination from "../components/UI/pagination/Pagination";
import {getPagesArray} from "../utils/pagination";
import SelectInput from "../components/UI/input/selectInput/SelectInput";

const ApplicationForAdoptionPage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [applicationForAdoption, setApplicationForAdoption] = useState([{}]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchApplicationForAdoption(id, limit, page).then(data => {
            setApplicationForAdoption(data.applicationForAdoption);
            setTotalPages(data.pagination.totalPages);
            setPage(data.pagination.currentPage);
            setIsLoading(false);
            setRefresh(false);
        });
    }, [page, refresh]);
    return (
        isLoading
            ?
            <div className={"application__wrapper"}>
                <Loader />
            </div>
            :
            <div className={"application__wrapper application"}>
                <div className="application__list">
                    {applicationForAdoption.length === 0
                        ?
                        <div className={"application__empty"}>
                            <h3>На дане оголошення, ще не прийшло не однієї заяви</h3>
                        </div>
                        :
                        <ApplicationForAdoptionList
                            applicationsForAdoption={applicationForAdoption}
                            setRefresh={(refresh) => setRefresh(refresh)}
                        />
                    }
                </div>
                <div className="application__pagintaion">
                    <Pagination
                        pagesArray={getPagesArray(totalPages)}
                        currentPage={page}
                        onClick={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>
    );
};

export default ApplicationForAdoptionPage;