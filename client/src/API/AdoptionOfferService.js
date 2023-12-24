import {$authHost} from "./axiosConfig";

export const fetchAdoptionOfferForOneShelter = async (
    limit = 999,
    page = 1,
    petName = ''
) => {
    const {data} = await $authHost.get(`api/pet-adoption-offer/shelter/`, {
        params: {
            limit: limit,
            page: page,
            petName: petName
        }
    })
    return data;
}

export const createAdoptionOffer = async (
    formData,
    petId
) => {
    return await $authHost.post(`api/pet-adoption-offer/${petId}`, formData);
}

export const deleteAdoptionOffer = async (adoptionOfferId) => {
    return await $authHost.delete(`api/pet-adoption-offer/${adoptionOfferId}`);
}

export const fetchOneAdoptionOffer = async (adoptionOfferId) => {
    const { data } = await $authHost.get(`api/pet-adoption-offer/one/${adoptionOfferId}`);
    return data;
}

export const updateAdoptionOffer = async (adoptionOfferId, formData) => {
    return await $authHost.put(`api/pet-adoption-offer/${adoptionOfferId}`, formData);
}

export const fetchAllAdoptionOffers = async (
    limit = 999,
    page = 1,
    petName = '',
    country = '',
    city = '',
) => {
    const { data } = await $authHost.get(`api/pet-adoption-offer/`, {
        params: {
            limit: limit,
            page: page,
            petName: petName,
            country: country,
            city: city
        }
    });
    return data;
}

