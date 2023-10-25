const request = require('supertest');
const app = require('../../index').app;
const jwt = require('jsonwebtoken');
const {User, Role, UserRole} = require('../../models/models');
const getUserRole = require('../../middleware/getUserRoles');

describe('User authorization tests', () => {

    test('Successful authorization test', async () => {
        const authorizationData = {
            "login": "jane",
            "password": "ukrainUser24$"
        };

        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationData)
            .expect(200);

        expect(response.body.token).toBeDefined();
        const decodedToken = jwt.verify(response.body.token, process.env.SECRET_KEY);
        const user = await User.findOne({where: {login: authorizationData.login}});
        let roles = [];
        roles = await getUserRole(user);

        const expectedDate = new Date(decodedToken.birthday);
        const receivedDateString = user.birthday;
        const receivedDate = new Date(receivedDateString);

        expect(receivedDate.toISOString()).toEqual(expectedDate.toISOString());


        expect(decodedToken.id).toEqual(user.id);
        expect(decodedToken.login).toEqual(user.login);
        expect(decodedToken.user_image).toEqual(user.user_image);
        expect(decodedToken.domain).toEqual(user.domain);
        expect(decodedToken.email).toEqual(user.email);
        expect(decodedToken.full_name).toEqual(user.full_name);
        expect(decodedToken.phone_number).toEqual(user.phone_number);
        expect(decodedToken.is_paid).toEqual(user.is_paid);
        expect(decodedToken.shelterId).toEqual(user.shelterId);
        expect(decodedToken.roles).toEqual(roles);
    });
    test('User authorization test without data', async () => {
       const authorizationData = {
           "login": "",
           "password": ""
       };
       const response = await request(app)
           .post('/api/user/authorization')
           .send(authorizationData)
           .expect(400);
       expect(response.body).toHaveProperty('message', 'Invalid login or password');
    });
    test('User authorization test with not correct login', async () => {
        const authorizationData = {
            "login": "test",
            "password": "ukrainUser24$"
        };

        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationData)
            .expect(400);
        expect(response.body).toHaveProperty('message', 'Invalid login or password');
    });
    test('User authorization test with not correct password', async () => {
        const authorizationData = {
            "login": "jane",
            "password": "test"
        };

        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationData)
            .expect(400);
        expect(response.body).toHaveProperty('message', 'Invalid login or password');
    });
    test('User authorization test with not correct login and password', async () => {
        const authorizationData = {
            "login": "test",
            "password": "test"
        };

        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationData)
            .expect(400);
        expect(response.body).toHaveProperty('message', 'Invalid login or password');
    });
});