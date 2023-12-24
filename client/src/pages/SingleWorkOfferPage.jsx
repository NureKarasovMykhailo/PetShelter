import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import '../styles/SingleWorkOfferPage.css';
import Loader from "../components/UI/loader/Loader";
import {fetchOneWorkOffer} from "../API/WorkOfferService";
import SingleWorkOffer from "../components/workOffer/singleWorkOffer/SingleWorkOffer";

const SingleWorkOfferPage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [workOffer, setWorkOffer] = useState({});

    useEffect(() => {
        fetchOneWorkOffer(id).then(data => {
            setWorkOffer(data.message);
            setIsLoading(false)
        })
    }, []);
    return (
        isLoading
            ?
            <div className={"public-single-work__wrapper"}>
                <Loader />
            </div>
            :
            <div className={"public-single-work__wrapper"}>
                <SingleWorkOffer
                    workOffer={workOffer}
                />
            </div>

    );
};

export default SingleWorkOfferPage;