import {$authHost, $host} from "./axiosConfig";
import {decodeToken} from 'react-jwt';

export const registration = async ({
    login,
    email,
    fullName,
    birthday,
    phoneNumber,
    password,
    passwordConfirm,
    userImage
}) => {
    const formData = new FormData();

    formData.append('userImage', userImage);
    formData.append('login', login);
    formData.append('email', email);
    formData.append('fullName', fullName);
    formData.append('birthday', birthday);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);
    formData.append('passwordConfirm', passwordConfirm);

    return await $host.post('api/user/registration', formData);
}

export const authorization = async (login, password) => {
    const response =
        await $host.post('api/user/authorization', {login, password});
    localStorage.setItem('token', response.data.token);
    return decodeToken(response.data.token);
}

export const checkAuth = async () => {
    const response = await $authHost.get('api/user/auth');
    return decodeToken(response.data.token);
}

export const getToken = async () => {
    const response = await $authHost.get('api/user/auth');
    return response.data.token;
}


export const subscribe = async () => {
    return await $authHost.post('api/user/subscribe');
}

export const getProfileInfo = async () => {
    return await $authHost.get('api/user/profile');
}

export const getSubscriptionDetail = async () => {
    return await $authHost.get('api/user/subscribe/detail');
}

export const changeUserImage = async (newUserImage) => {
    const formData = new FormData();
    formData.append('newUserImage', newUserImage);
    console.log(newUserImage)
    return await $authHost.post('api/user/change/image', formData);

}

export const changeEmail = async({newEmail}) => {
    return await $authHost.post('api/user/change/email', { newEmail });
}

export const sendConfirmationCode = async (email) => {
    return await $host.post('api/user/change/password/code', { email });
}

export const checkConfirmationCode = async (confirmationCode, email) => {
    return await $host.post('api/user/change/password/code/check  ', {confirmationCode, email});
}

export const changePassword = async (email, newPassword, passwordConfirm) => {
    return await $host.post('api/user/change/password/code/changing', { email, newPassword, passwordConfirm });
}

export const changePhone = async (newPhoneNumber) => {
    return await $authHost.post('api/user/change/telephone', { newPhoneNumber });
}

export const fetchRoles = async () => {
    const {data} = await $authHost.get('api/user/roles')
    return data.message;
}