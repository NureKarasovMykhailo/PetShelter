import {$authHost} from "./axiosConfig";
import shelterForm from "../components/shelter/ShelterForm";


export const createShelter = async ({
    shelterName,
    shelterCountry,
    shelterCity,
    shelterStreet,
    shelterHouse,
    shelterDomain,
    subscriberDomainEmail,
    shelterImage
}) => {
    const formData = new FormData();
    formData.append('shelterName', shelterName);
    formData.append('shelterCountry', shelterCountry);
    formData.append('shelterCity', shelterCity);
    formData.append('shelterStreet', shelterStreet);
    formData.append('shelterHouse', shelterHouse);
    formData.append('shelterDomain', shelterDomain);
    formData.append('subscriberDomainEmail', subscriberDomainEmail);
    formData.append('shelterImage', shelterImage)

    return await $authHost.post('api/shelter/', formData);
}

export const getShelter = async (shelterId) => {
    return await $authHost.get(`api/shelter/one/${shelterId}`)
}

export const deleteShelter = async () => {
    return await $authHost.delete('api/shelter/');
}

export const updateShelter = async ({
    newShelterName,
    newShelterCity,
    newShelterStreet,
    newShelterHouse,
    newShelterDomain,
    shelterImage,
    newShelterCountry,
}, shelterId) =>  {
    const formData = new FormData()
    formData.append('newShelterName', newShelterName);
    formData.append('newShelterCity', newShelterCity);
    formData.append('newShelterStreet', newShelterStreet);
    formData.append('newShelterHouse', newShelterHouse);
    formData.append('newShelterDomain', newShelterDomain);
    formData.append('newShelterCountry', newShelterCountry);
    formData.append('shelterImage', shelterImage)



    return await $authHost.put(`api/shelter/${shelterId}`, formData);
}