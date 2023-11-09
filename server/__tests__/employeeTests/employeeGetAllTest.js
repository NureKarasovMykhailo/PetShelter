const request = require('supertest');
const app = require('../../index').app;
const getToken = require('../../functions/getToken');

class employeeGetAllTest{
    getAllEmployeePath = '/api/user/employee';

    getAllEmployeeWithoutAuthToken(){
        test('Get all employee without authorization token', async() => {
            const response = await request(app)
                .get(this.getAllEmployeePath)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    getAllEmployeeByNonAuthorizedToken(){
        test('Get all employee with invalid authorization token', async() => {
            const token = 'adskdjfdsagijdsaf';

            const response = await request(app)
                .get(this.getAllEmployeePath)
                .set('Authorization', 'Bearer ' + token)
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    getAllEmployeeByUserWithOutShelter(userWithOutShelterAuthInfo){
        test('Get all employee by user without shelter', async() => {
            const token = await getToken(userWithOutShelterAuthInfo);

            const response = await request(app)
                .get(this.getAllEmployeePath)
                .set('Authorization', 'Bearer ' + token)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'You do not have a shelter');
        });
    }

    successfulGettingAllEmployee(userAuthInfo){
        test('Successful getting all employee', async() => {
            const token = await getToken(userAuthInfo);

            const response = await request(app)
                .get(this.getAllEmployeePath)
                .set('Authorization', 'Bearer ' + token)
                .expect(200);

            expect(response.body).toHaveProperty('employees');
            const employees = response.body.employees;

        });
    }

}

module.exports = new employeeGetAllTest();