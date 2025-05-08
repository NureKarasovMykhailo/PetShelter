import {$authHost} from "./axiosConfig";

export const createEmployee = async ({
    login,
    domainEmail,
    email,
    fullName,
    birthday
}) => {

    const formData = new FormData();
    formData.append('login', login);
    formData.append('domainEmail', domainEmail);
    formData.append('email', email);
    formData.append('fullName', fullName);
    formData.append('birthday', birthday);

    return await $authHost.post('api/employee/', formData);
}

export const fetchEmployee = async (
    limit = 6,
    page = 1,
    roleTitle = '',
    sortBy = '',
    domainEmail = ''
) => {

    const { data } = await $authHost.get('api/employee', {
        params: {
            limit: limit,
            page: page,
            roleTitle: roleTitle,
            sortBy: sortBy,
            domainEmail: domainEmail
        }
    });
    return data;
}

export const deleteEmployee = async (employeeId) => {
    return await $authHost.delete(`api/employee/${employeeId}`);
}

export const addRoles = async (employeeId, roles) => {

   return await $authHost.patch(`api/employee/roles/add/${employeeId}`, {roles: roles.toString()});
}

export const deleteRoles = async (employeeId, roles) => {
    return $authHost.patch(`api/employee/roles/delete/${employeeId}`, {roles: roles.toString()});
}