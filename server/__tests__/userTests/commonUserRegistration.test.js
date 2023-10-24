const request = require('supertest');
const app = require('../../index').app;
const {User, Role} = require('../../models/models');
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

    test('Common user registration with no data', async() => {
        registrationInformation = {
            "login": "",
            "email": "",
            "fullName": "",
            "birthday": "",
            "phoneNumber": "",
            "password": "",
            "passwordConfirm": ""
        }

        const response = await request(app)
            .post('/api/user/registration')
            .send(registrationInformation)
            .expect(400);
    });
    test('Common user registration with existed user', async() => {
        const registrationInformation = {
            "login": "jane",
            "email": "jane@gmail.com",
            "fullName": "Джейн Моріарті",
            "birthday": "2004-05-02",
            "phoneNumber": "380997105162",
            "password": "ukrainUser24$",
            "passwordConfirm": "ukrainUser24$"
        };

        const response = await request(app)
            .post('/api/user/registration')
            .send(registrationInformation)
            .expect(400);
        expect(response.body).toHaveProperty('message', 'User with this data already exists');
    })
    test('Common user registration with to small login, not correct email,' +
        'not correct full name, not correct birthday, not correct phone number, ' +
        'and not correct password', async() => {
            
            const registrationInformation = {
                "login": "tes",
                "email": "test",
                "fullName": "test",
                "birthday": "test",
                "phoneNumber": "test",
                "password": "1234",
                "passwordConfirm": "1234"
            };

            const response = await request(app)
                .post('/api/user/registration')
                .send(registrationInformation)
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toHaveProperty('errors');
        });
    test('Common user registration with to big login, too small phone number and ' + 
        'and not correct password confirm', async () => {
            const registrationInformation = {
                "login": "janeeeeeee",
                "email": "test@gmail.com",
                "fullName": "Test User",
                "birthday": "2004-05-02",
                "phoneNumber": "3213",
                "password": "ukrainUser24$",
                "passwordConfirm": "ukrainUser24"
            };

            const response = await request(app)
                .post('/api/user/registration')
                .send(registrationInformation)
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toHaveProperty('errors');
        });

        test('Common user registration with too big phone number and ' + 
        'and not correct login', async () => {
            const registrationInformation = {
                "login": "івфівіфjane",
                "email": "test@gmail.com",
                "fullName": "Test User",
                "birthday": "2004-05-02",
                "phoneNumber": "12345678910111213141516",
                "password": "ukrainUser24$",
                "passwordConfirm": "ukrainUser24$"
            };

            const response = await request(app)
                .post('/api/user/registration')
                .send(registrationInformation)
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toHaveProperty('errors');
        });
});




