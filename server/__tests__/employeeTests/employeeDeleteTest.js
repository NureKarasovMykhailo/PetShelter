const request = require('supertest');
const app = require('../../index').app;
const getToken = require('../../functions/getToken');
const {User} = require('../../models/models');

class employeeDeletingTest{
    employeeDeletePath = '/api/user/employee/';

    deleteEmployeeWithOutAuthToken(userForDeletingAuthInfo){
        test('Deleting employee without authorization token', async() => {
            const employeeForDeleting = await User.findOne({where: {login: userForDeletingAuthInfo.login}})

            const response = await request(app)
                .delete(this.employeeDeletePath + employeeForDeleting.id)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    deleteEmployeeWithInvalidAuthToken(userForDeletingAuthInfo){
        test('Deleting employee with invalid authorization token', async() => {
            const employeeForDeleting = await User.findOne({where: {login: userForDeletingAuthInfo.login}})

            const invalidToken = 'dfasafdasfsaf';
            const response = await request(app)
                .delete(this.employeeDeletePath + employeeForDeleting.id)
                .set('Authorization', 'Bearer ' + invalidToken)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    deleteEmployeeByNotShelterMember(notShelterMemberAuthInfo, userForDeletingAuthInfo){
        test('Deleting employee by not shelter member', async() => {
            const employeeForDeleting = await User.findOne({where: {login: userForDeletingAuthInfo.login}});
            const token = await getToken(notShelterMemberAuthInfo);

            const response = await request(app)
                .delete(this.employeeDeletePath + employeeForDeleting.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'You do not have access to information of this shelter');
        });
    }

    deletingWithNotCorrectRole(defaultUserAuthInfo, userForDeletingAuthInfo){
        test('Deleting employee by user with invalid role', async() => {
            const employee = await User.findOne({where: {login: userForDeletingAuthInfo.login}});
            const token = await getToken(defaultUserAuthInfo);

            const response = await request(app)
                .delete(this.employeeDeletePath + employee.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'Access dined');
        });
    }

    subscriberDeleting(authInfo, subscriberInfo){
        test('Subscriber deleting', async() => {
            const subscriberForDeleting = await User.findOne({where: {login: subscriberInfo.login}});
            const token = await getToken(authInfo);

            const response = await request(app)
                .delete(this.employeeDeletePath + subscriberForDeleting.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'You can not delete the owner of the shelter');
        });
    }

    deleteUserWithInvalidId(authInfo){
        test('Deleting user with invalid ID', async() => {
            const token = await getToken(authInfo);

            const response = await request(app)
                .delete(this.employeeDeletePath + 1)
                .set('Authorization', 'Bearer ' + token)
                .expect(400);
            expect(response.body).toHaveProperty('message', `There is not user with id:1`)
        });
    }

    successfulDeleting(authInfo, userForDeleting){
        test('Successful deleting', async() => {
            const employeeForDeleting = await User.findOne({where: {login: userForDeleting.login}});
            const token = await getToken(authInfo);

            const response = await request(app)
                .delete(this.employeeDeletePath + employeeForDeleting.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(200);
            expect(response.body).toHaveProperty('message', `Employee ${employeeForDeleting.login} was deleted`);
            const deletedUser = await User.findOne({where: {login: userForDeleting.login}});
            expect(deletedUser).toBeNull();
        });
    }
}

module.exports = new employeeDeletingTest();