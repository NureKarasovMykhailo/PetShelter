import {$authHost} from "./axiosConfig";

export const fetchShelterWorkOffers = async (
    limit = 999,
    page = 1,
    title,
) => {
    const { data } = await $authHost.get('api/work-offer/shelter', {
        params: {
            limit,
            page,
            title
        }
    });
    return data;
}

export const createWorkOffer = async (formData) => {
    return await $authHost.post('api/work-offer/', formData);
}

export const deleteWorkOffer = async (workOfferId) => {
    return await $authHost.delete(`api/work-offer/${workOfferId}`);
}

export const fetchOneWorkOffer = async (workOfferId) => {
    const { data } = await $authHost.get(`api/work-offer/one/${workOfferId}`);
    return data;
}

export const updateWorkOffer = async (workOfferId, formData) => {
    return await $authHost.put(`api/work-offer/${workOfferId}`, formData);
}

export const fetchAllWorkOffers = async (
    limit = 999,
    page = 1,
    country = '',
    city = '',
    title = '',
) => {
    const { data } = await $authHost.get('api/work-offer', {
        params: {
            limit,
            page,
            country,
            city,
            title
        }
    });
    return data;
}