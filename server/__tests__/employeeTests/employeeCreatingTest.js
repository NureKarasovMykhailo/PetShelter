const request = require('supertest');
const app = require('../../index').app;
const getToken = require('../../functions/getToken');
const {User, UserRole, Role} = require('../../models/models');

const getUserRole = require('../../middleware/getUserRoles');

class employeeCreatingTest{
    employeeCreatingPath = '/api/user/employee/registration';

    async employeeCreatingByNotAuthorizedUser(newEmployeeInfo){
        test('Creating employee by not authorized user', async () => {
           const response = await request(app)
               .post(this.employeeCreatingPath)
               .field('login', newEmployeeInfo.login)
               .field('domainEmail', newEmployeeInfo.domainEmail)
               .field('email', newEmployeeInfo.email)
               .field('fullName', newEmployeeInfo.fullName)
               .field('birthday', newEmployeeInfo.birthday)
               .field('roles', newEmployeeInfo.roles)
               .expect(401);
           expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    async employeeCreatingByDefaultUser(newEmployeeInfo, userInfo){
        test('Employee creating by default user', async () => {
            const token = await getToken(userInfo);
            const response = await request(app)
                .post(this.employeeCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .field('login', newEmployeeInfo.login)
                .field('domainEmail', newEmployeeInfo.domainEmail)
                .field('email', newEmployeeInfo.email)
                .field('fullName', newEmployeeInfo.fullName)
                .field('birthday', newEmployeeInfo.birthday)
                .field('roles', newEmployeeInfo.roles)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'Access dined');
        });
    }

    async employeeCreatingByUserWithOutShelter(newEmployeeInfo, userInfo){
        test('Employee creating by user with out shelter', async () => {
            const token = await getToken(userInfo);

            const response = await request(app)
                .post(this.employeeCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .field('login', newEmployeeInfo.login)
                .field('domainEmail', newEmployeeInfo.domainEmail)
                .field('email', newEmployeeInfo.email)
                .field('fullName', newEmployeeInfo.fullName)
                .field('birthday', newEmployeeInfo.birthday)
                .field('roles', newEmployeeInfo.roles)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'You do not have a shelter');
        });
    }

    async employeeCreatingWithOutData(userInfo){
        const token = await getToken(userInfo);

        const response = await request(app)
            .post(this.employeeCreatingPath)
            .field('login', '')
            .field('domainEmail', '')
            .field('email', '')
            .field('fullName', '')
            .field('birthday', '')
            .field('roles', '')
            .set('Authorization', 'Bearer ' + token)
            .expect(400);

        expect(response.body).toHaveProperty('message');
        const errors = response.body.message.errors;
        expect(errors).toEqual(expect.arrayContaining([
            {
                "type": "field",
                "value": "",
                "msg": "Please enter login",
                "path": "login",
                "location": "body"
            },
            {
                "type": "field",
                "value": "",
                "msg": "Please enter your email",
                "path": "email",
                "location": "body"
            },
            {
                "type": "field",
                "value": "",
                "msg": "Please enter your full name",
                "path": "fullName",
                "location": "body"
            },
            {
                "type": "field",
                "value": "",
                "msg": "Please enter your birthday",
                "path": "birthday",
                "location": "body"
            },
            {
                "type": "field",
                "value": "",
                "msg": "Please enter domain email",
                "path": "domainEmail",
                "location": "body"
            },

        ]));
    }

    async employeeCreatingWithExistedData(existedEmployeeInfo, userInfo){
        test('Employee creating with existed data', async() => {
            const token = await getToken(userInfo);

            const response = await request(app)
                .post(this.employeeCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .field('login', existedEmployeeInfo.login)
                .field('domainEmail', existedEmployeeInfo.domainEmail)
                .field('email', existedEmployeeInfo.email)
                .field('fullName', existedEmployeeInfo.fullName)
                .field('birthday', existedEmployeeInfo.birthday)
                .field('roles', ["user"])
                .expect(400);

            expect(response.body).toHaveProperty('message', 'User with such data already exist');
        });
    }

    async employeeCreatingWithInvalidData(userInfo){
        test('Employee creating with invalid data', async() => {
            const token = await getToken(userInfo);

            const response = await request(app)
                .post(this.employeeCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .field('login', 'das')
                .field('domainEmail', 'dsa')
                .field('email', 'dsa')
                .field('fullName', 'das')
                .field('birthday', 'das')
                .field('roles', ["user"])
                .expect(400);
            expect(response.body).toHaveProperty('message');
            const errors = response.body.message.errors;
            expect(errors).toEqual(expect.arrayContaining([
                {
                    "type": "field",
                    "value": "das",
                    "msg": "Login must be from 4 to 35 letters",
                    "path": "login",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "dsa",
                    "msg": "Please enter a correct email",
                    "path": "email",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "das",
                    "msg": "Your name must consist of two words",
                    "path": "fullName",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "das",
                    "msg": "Please enter a valid birthday",
                    "path": "birthday",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "dsa",
                    "msg": "Please enter correct domain email",
                    "path": "domainEmail",
                    "location": "body"
                }
            ]));
        });
    }

    async successfulEmployeeCreating(newEmployeeInfo, userInfo){
        test('Successful employee creating', async() => {
            const token = await getToken(userInfo);

            const response = await request(app)
                .post(this.employeeCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .field('login', newEmployeeInfo.login)
                .field('domainEmail', newEmployeeInfo.domainEmail)
                .field('email', newEmployeeInfo.email)
                .field('fullName', newEmployeeInfo.fullName)
                .field('birthday', newEmployeeInfo.birthday)
                .field('roles', newEmployeeInfo.roles)
                .expect(200);

            const addedEmployee = await User.findOne({where: {login: newEmployeeInfo.login}})
            expect(response.body.id).toEqual(addedEmployee.id);
            expect(response.body.login).toEqual(addedEmployee.login);
            expect(response.body.email).toEqual(addedEmployee.email);
        });
    }
}

module.exports = new employeeCreatingTest();