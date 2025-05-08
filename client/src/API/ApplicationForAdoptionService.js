import {$authHost} from "./axiosConfig";

export const createApplicationForAdoption = async (adoptionOfferId, applicationAddress) => {
    return await $authHost.post(`api/pet-adoption-application/${adoptionOfferId}`, {applicationAddress});
}

export const fetchApplicationForAdoption = async (
    adoptionOfferId,
    limit,
    page,
) => {
    const { data } = await $authHost.get(`api/pet-adoption-application/adoptionOffer/${adoptionOfferId}`, {
        params: {
            limit,
            page,
        }
    });
    return data;
}

export const approvedApplication = async (applicationId) => {
    return await $authHost.patch(`api/pet-adoption-application/approved/${applicationId}`);
}

export const deleteApplication = async (applicationId) => {
    return await $authHost.delete(`api/pet-adoption-application/${applicationId}`);
}