const request = require('supertest');
const app = require('../index').app;
const {User, Role} = require('../models/models');
const bcrypt = require('bcrypt');
describe('Common user registration tests', () => {
    test('Successful common user registration test', async() => {
        const registrationInformation = {
            "login": "testUser",
            "email": "test.email@gnail.com",
            "fullName": "Test User",
            "birthday": "2004-05-02",
            "phoneNumber": "3213123213213",
            "password": "ukrainUser24$",
            "passwordConfirm": "ukrainUser24$"
        };

        const response = await request(app)
            .post('/api/user/registration')
            .send(registrationInformation)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'User successfully created');
        const user = await User.findOne({where: {login: registrationInformation.login}});
        const role = await Role.findOne({where: {role_title: 'user'}});

        expect(user).toBeDefined();
        expect(user.login).toEqual(registrationInformation.login);
        expect(user.email).toEqual(registrationInformation.email);
        expect(user.full_name).toEqual(registrationInformation.fullName);
        expect(user.phone_number).toEqual(registrationInformation.phoneNumber);
        expect(bcrypt.compareSync(registrationInformation.password, user.hashed_password))
            .toBeTruthy();

        await User.destroy({where: {login: registrationInformation.login}});
    });

});