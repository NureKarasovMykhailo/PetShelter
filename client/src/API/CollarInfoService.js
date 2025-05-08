import {$authHost} from "./axiosConfig";

export const fetchCollarInfo = async (collarId) => {
    const {data} = await $authHost.get(`api/collar-info/collar/${collarId}`);
    return data;
}

export const clearCollarInfo = async (collarId) => {
    return await $authHost.delete(`api/collar-info/collar/${collarId}`);
}

export const deleteCollarInfo = async (collarInfoId) => {
    return await $authHost.delete(`api/collar-info/${collarInfoId}`);
}