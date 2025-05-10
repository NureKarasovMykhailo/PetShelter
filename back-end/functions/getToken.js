const request = require("supertest");
const app = require("../index").app;

module.exports = async  (userData) => {
    const response = await request(app)
        .post('/api/user/authorization')
        .send(userData)
        .expect(200);
    return response.body.token;
}