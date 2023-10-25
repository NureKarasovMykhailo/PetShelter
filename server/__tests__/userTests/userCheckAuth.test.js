const request = require('supertest');
const app = require('../../index').app;
const jwt = require('jsonwebtoken');
const {User, Role, UserRole} = require('../../models/models');
const getUserRole = require("../../middleware/getUserRoles");

const authData = {
    "login": "jane",
    "password": "ukrainUser24$"
};

async function getValidToken(){
    const response = await request(app)
        .post('/api/user/authorization')
        .send(authData);
    console.log(response.body.token)
    return response.body.token;
}
describe('User authorization checking tests', () => {
   test('User authorization checking with invalid token', async () => {
       let invalidToken = await getValidToken()
       invalidToken = 'Bearer ' + invalidToken + 'adsad';

       const response = await request(app)
           .get('/api/user/auth')
           .set('Authorization', invalidToken);
       expect(response.body).toHaveProperty('message', 'Non authorized user');
   });
   test('User authorization checking without token', async () => {
       const response = await request(app)
           .get('/api/user/auth')
           .set('Authorization', '');
       expect(response.body).toHaveProperty('message', 'Non authorized user');
   });
    test('Succeed user authorization checking test', async() => {
        let validToken = await getValidToken();
        validToken = 'Bearer ' + validToken;
        console.log(validToken)
        const response = await request(app)
            .get('/api/user/auth')
            .set('Authorization', validToken);
        expect(response.body.token).toBeDefined();

        const decodedToken = jwt.verify(response.body.token, process.env.SECRET_KEY);
        const user = await User.findOne({where: {login: authData.login}});
        let roles = [];
        roles = await getUserRole(user);
        console.log(roles);
        console.log(decodedToken.roles)

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
        expect(decodedToken.roles).toEqual(expect.arrayContaining(roles));
    });

});