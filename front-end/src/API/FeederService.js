import {$authHost} from "./axiosConfig";

export const createFeeder = async ({
    feederColour,
    designedFor,
    capacity
}) => {
    return await $authHost.post('api/feeder/', {feederColour, designedFor, capacity});
}

export const fetchFeeder = async (
    limit = 999,
    page = 1
) => {
    const { data } = await $authHost.get('api/feeder/', {
        params: {
            limit: limit,
            page: page
        }
    });
    return data;
}

export const deleteFeeder = async (feederId) => {
    return await $authHost.delete(`api/feeder/${feederId}`);
}

export const updateFeeder = async (feederId, {
    feederColour,
    designedFor,
    capacity
}) => {
    return await $authHost.put(`api/feeder/${feederId}`, { feederColour, designedFor, capacity });
}

export const setFeeder = async(feederId, petId) => {
    return await $authHost.patch(`api/feeder/set/${feederId}`, {}, {
        params: {
            petId: petId
        }
    });
}

export const unpinFeeder = async (feederId) => {
    return await $authHost.patch(`api/feeder/unpin/${feederId}`);
}