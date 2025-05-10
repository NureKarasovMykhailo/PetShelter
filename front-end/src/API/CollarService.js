import {$authHost} from "./axiosConfig";
import axios from "axios";

export const fetchCollars = async (
    limit = 999,
    page = 1
) => {
    const {data} = await $authHost.get('api/collar/', {
        params: {
            limit: limit,
            page: page
        }
    });
    return data;
}

export const createCollar = async ({
    minTemperature,
    maxTemperature,
    minPulse,
    maxPulse
}) => {
    return await $authHost.post('api/collar/', {
        minTemperature,
        maxTemperature,
        minPulse,
        maxPulse
    });
}

export const updateCollar = async ({
    newMinTemperature,
    newMaxTemperature,
    newMinPulse,
    newMaxPulse,
}, collarId) => {
    return await $authHost.put(`api/collar/${collarId}`, {
        newMinPulse,
        newMaxPulse,
        newMaxTemperature,
        newMinTemperature
    });
}

export const deleteCollar = async (collarId) => {
    return await $authHost.delete(`api/collar/${collarId}`);
}

export const setCollar = async (collarId, petId) => {
    return await $authHost.patch(`api/collar/set/${collarId}`, {}, {
        params: {
            petId: petId
        }
    });
}

export const unpinCollar = async (collarId, petId) => {
    return await $authHost.patch(`api/collar/unpin/${collarId}`, {}, {
        params: {
            petId: petId
        }
    });
}