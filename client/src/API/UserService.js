import {$authHost, $host} from "./axiosConfig";


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

    const response = await $host.post('api/user/registration', formData);
    return response;
}

export const authorization = async (login, password) => {
    const response =
        await $host.post('api/user/authorization', {login, password});
    localStorage.setItem('token', response.data.token);
    return response
}

export const checkAuth = async () => {
    const response = await $authHost.get('api/user/auth');
    return response;
}