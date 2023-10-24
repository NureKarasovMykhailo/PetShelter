const app = require('../../index').app;
const request = require('supertest');
const jwt = require('jsonwebtoken');
const {User, UserRole, Role} = require('../../models/models');

const getUserRoles = async function(userRoles, roles) {
    await Promise.all(userRoles.map(async userRole => {
        let role = await Role.findOne({ where: { id: userRole.roleId } });
        roles.push(role.role_title);
    }));
}

describe('Common user authorization tests', () => {
    test('Successful common user authorization test', async() => {
        const authorizationInformation = {
            "login": "jane",
            "password": "ukrainUser24$"
        };
    
        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationInformation)
            .expect(200);
    
        expect(response.body.token).toBeDefined();
        const token = response.body.token;
    
        const user = await User.findOne({where: {login: authorizationInformation.login}});
        const userRoles = await UserRole.findAll({where: {userId: user.id}});
        let roles = [];
        await getUserRoles(userRoles, roles);
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        expect(decodedToken).toHaveProperty('roles');
        const tokenRoles = decodedToken.roles;
        expect(decodedToken).toHaveProperty('login', user.login);
        expect(decodedToken).toHaveProperty('id', user.id);
        expect(decodedToken).toHaveProperty('user_image', user.user_image);
        expect(decodedToken).toHaveProperty('domain_email', user.domain_email);
        expect(decodedToken).toHaveProperty('email', user.email);
        expect(decodedToken).toHaveProperty('full_name', user.full_name);
        expect(decodedToken).toHaveProperty('birthday');
        expect(decodedToken).toHaveProperty('phone_number', user.phone_number);
        expect(decodedToken).toHaveProperty('is_paid', user.is_paid);
        expect(decodedToken).toHaveProperty('shelterId', user.shelterId);
        expect(tokenRoles).toEqual(roles);

    });

    test('Common user authorization with not correct login', async() => {
        const authorizationInformation = {
            "login": "notCorrectLogin",
            "password": "ukrainUser24$"
        };

        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationInformation)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Invalid login or password');
    });

    test('Common user authorization with not correct password', async() => {
        const authorizationInformation = {
            "login": "jane",
            "password": "ukrainUser24$1"
        };

        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationInformation)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Invalid login or password');
    });
    test('Common user authorization with not correct login and password', async() => {
        const authorizationInformation = {
            "login": "notCorrectLogin",
            "password": "ukrainUser24$1"
        };

        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationInformation)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Invalid login or password');
    });
    test('Common user authorization with no data', async() => {
        const authorizationInformation = {
            "login": "",
            "password": ""
        };

        const response = await request(app)
            .post('/api/user/authorization')
            .send(authorizationInformation)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Invalid login or password');
    });
});