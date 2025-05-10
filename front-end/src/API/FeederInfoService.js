import {$authHost} from "./axiosConfig";

export const fetchFeederInfo = async (feederId) => {
    const {data} = await $authHost.get(`api/feeder-info/feeder/${feederId}`);
    return data;
}

export const clearFeederInfo = async (feederId) => {
    return await $authHost.delete(`api/feeder-info/feeder/${feederId}`);
}

export const deleteFeederInfo = async (feederInfoId) => {
    return await $authHost.delete(`api/feeder-info/${feederInfoId}`);
}
