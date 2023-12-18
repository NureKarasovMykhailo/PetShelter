import {$authHost} from "./axiosConfig";


export const createShelter = async ({
    shelterName,
    shelterCountry,
    shelterCity,
    shelterStreet,
    shelterHouse,
    shelterDomain,
    subscriberDomainEmail
}) => {
    const formData = new FormData();
    formData.append('shelterName', shelterName);
    formData.append('shelterCountry', shelterCountry);
    formData.append('shelterCity', shelterCity);
    formData.append('shelterStreet', shelterStreet);
    formData.append('shelterHouse', shelterHouse);
    formData.append('shelterDomain', shelterDomain);
    formData.append('subscriberDomainEmail', subscriberDomainEmail);

    return await $authHost.post('api/shelter/', formData);
}