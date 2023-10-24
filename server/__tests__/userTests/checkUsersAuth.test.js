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

describe('User auth checking tests', () => {
    test('User auth checking with valid JWT token', async() => {
        const loginData = {
            "login": "jane",
            "password": "ukrainUser24$"
        };
        const response = await request(app)
            .post('/api/user/authorization')
            .send(loginData)
            .expect(200);
        expect(response.body.token).toBeDefined();
        const authToken = "Bearer " + response.body.token;

        const checkingResponse = await request(app)
            .get('/api/user/auth')
            .set('Authorization', authToken)
            .expect(200);

        expect(checkingResponse.body.token).toBeDefined();

        const user = await User.findOne({where: {login: loginData.login}});
        const userRoles = await UserRole.findAll({where: {userId: user.id}});
        let roles = [];
        await getUserRoles(userRoles, roles);
        const decodedToken = jwt.verify(checkingResponse.body.token, process.env.SECRET_KEY);
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

    test('User auth checking with not correct JWT token', async () => {
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibG9naW4iOiJqYW5lI" +
        "iwidXNlcl9pbWFnZSI6ImRlZmF1bHQtdXNlci1pbWFnZS5qcGciLCJkb21haW5fZW1haWwiOm51bGwsImVtYW" +
        "lsIjoiamFuZUBnbWFpbC5jb20iLCJmdWxsX25hbWUiOiLQlNC20LXQudC9INCc0L7RgNGW0LDRgNGC0ZYiLCJiaXJ0aGRhe" + 
        "SI6IjIwMDQtMDUtMDJUMDA6MDA6MDAuMDAwWiIsInBob25lX251bWJlciI6IjM4MDk5NzEwNTE2MiIsImlzX3BhaWQiOmZhbHNlLCJ" +
        "zaGVsdGVySWQiOm51bGwsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNjk4MTU4NzI2LCJleHAiOjE2OTgyNDUxMjZ9.cu60Zd3vD2vnmen5" +
        "7zrhINMHmYA9r0CuAKZ-HJwbAtYdsa";

        const response = await request(app)
        .get('/api/user/auth')
        .set('Authorization', token)
        .expect(401);

        expect(response.body).toHaveProperty('message', 'Non authorized user');

    });
    test('User auth checking without JWT token', async () => {
        
        const response = await request(app)
        .get('/api/user/auth')
        .expect(401);

        expect(response.body).toHaveProperty('message', 'Non authorized user');

    });
});