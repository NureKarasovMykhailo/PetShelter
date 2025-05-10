import {$authHost} from "./axiosConfig";

export const fetchPets = async (
    limit = 6,
    page = 1,
    petKind = '',
    gender = '',
    sortByAge = '',
    petName = ''
) => {
    const {data} = await $authHost.get('api/pet', {
        params: {
            limit: limit,
            page: page,
            petKind: petKind,
            gender: gender,
            sortByAge: sortByAge,
            petName: petName
        }
    });
    return data;
}

export const fetchKinds = async () => {
    const { data } = await $authHost.get('api/pet/kind')
    return data;
}

export const addPet = async ({
    petName,
    petAge,
    petGender,
    cellNumber,
    petImage,
    info,
    petKind
}) => {
    const formData = new FormData();
    formData.append('petName', petName);
    formData.append('petAge', petAge);
    formData.append('petGender', petGender);
    formData.append('cellNumber', cellNumber);
    formData.append('petImage', petImage);
    formData.append('info', JSON.stringify(info));
    formData.append('petKind', petKind);

    return await $authHost.post('api/pet', formData);
}

export const deletePet = async (petId) => {
    return await $authHost.delete(`api/pet/${petId}`)
}

export const fetchOnePet = async (petId) => {
    const {data} = await $authHost.get(`api/pet/one/${petId}`);
    return data.pets;
}

export const updatePet = async (petId, formData) => {

    return await $authHost.put(`api/pet/${petId}`, formData);
}