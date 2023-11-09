const request = require('supertest');
const app = require('../../index').app;
const getToken = require('../../functions/getToken');
const {User} = require('../../models/models');

class employeeGetOneTest{
    employeeGetOne = "/api/user/employee/";

    getWithoutAuthToken(employeeData){
        test('Get one employee without token', async() => {
            const employee = await User.findOne({where: {login: employeeData.login}})

            const response = await request(app)
                .get(this.employeeGetOne + employee.id)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    getByInvalidAuthToken(employeeData){
        test('Get one employee with invalid token', async() => {
            const employee = await User.findOne({where: {login: employeeData.login}});

            const response = await request(app)
                .get(this.employeeGetOne + employee.id)
                .set('Authorization', 'Bearer jgoijdasifjiodsajfjsadjfojasd')
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');

        });
    }

    getByUserWithOutShelter(userWithOutShelter, employeeData){
        test('Get one employee by user without shelter', async() => {
            const employee = await User.findOne({where: {login: employeeData.login}});
            const token = await getToken(userWithOutShelter);

            const response = await request(app)
                .get(this.employeeGetOne + employee.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(400)
            expect(response.body).toHaveProperty('message', 'You do not have a shelter');
        });
    }

    getByNotShelterMember(employeeData, userNotShelterMember){
        test('Get one employee by not shelter member', async() => {
            const employee = await User.findOne({where: {login: employeeData.login}});
            const token = await getToken(userNotShelterMember);

            const response = await request(app)
                .get(this.employeeGetOne + employee.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(403)
            expect(response.body).toHaveProperty('message', 'You do not have access to information of this shelter');
        });
    }

    getWithInvalidId(userAuthInfo){
        test('Get one employee with invalid id', async() => {
            const token = await getToken(userAuthInfo);

            const response = await request(app)
                .get(this.employeeGetOne + 0)
                .set('Authorization', 'Bearer ' + token)
                .expect(400)
            expect(response.body).toHaveProperty('message', 'There is not user with id:0');
        });
    }

    successfulGettingEmployee(employeeData, userAuthInfo){
        test('Successful getting one employee', async() => {
            const employee = await User.findOne({where: {login: employeeData.login}});
            const token = await getToken(userAuthInfo);

            const response = await request(app)
                .get(this.employeeGetOne + employee.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(200);


            expect(employee.id).toEqual(response.body.id);
            expect(employee.login).toEqual(response.body.login);
            expect(employee.user_image).toEqual(response.body.user_image);
            expect(employee.domain_email).toEqual(response.body.domain_email);
            expect(employee.email).toEqual(response.body.email);
            expect(employee.full_name).toEqual(response.body.full_name);
            expect(employee.phone_number).toEqual(response.body.phone_number);
            expect(employee.hashed_password).toEqual(response.body.hashed_password);
            expect(employee.is_paid).toEqual(response.body.is_paid);
            expect(employee.shelterId).toEqual(response.body.shelterId);
        });
    }

}

module.exports = new employeeGetOneTest();