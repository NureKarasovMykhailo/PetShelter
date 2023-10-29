const request = require('supertest');
const app = require('../../index').app;
const path = require('path');
const {User, Role, UserRole} = require('../../models/models');
const fs = require('fs');
const bcrypt = require('bcrypt');
const {toDate} = require("validator");
const getUserRoles = require('../../middleware/getUserRoles');

const registrationData = {
    "login": "testUser",
    "email": "test@gmail.com",
    "fullName": "Test User User",
    "birthday": "2004-05-02",
    "phoneNumber": "3800990175163",
    "password": "ukrainUser24$",
    "passwordConfirm": "ukrainUser24$",
    "userImage": path.resolve(__dirname, '../../static/', 'test.jpg')
};

const defaultUserImageName = 'default-user-image.jpg';
const deleteUserImageFromStatic = (user) => {
    let userImageName = user.user_image;
    fs.unlink(
        path.resolve(__dirname, '../../static/', userImageName),
        (err
        ) => {
        if (err) {
            console.error(`Error while deleting file: ${err}`);
        } else {
            console.log(`File ${path} successfully deleted`);
        }
    });
};

describe('Registration tests', () => {

    afterAll(async () => {
        const user = await User.findOne({where: {login: registrationData.login}});
        deleteUserImageFromStatic(user);
        await user.destroy();
    });


   test('User registration with existing data', async() => {

      const response = await request(app)
          .post('/api/user/registration')
          .attach('userImage', registrationData.userImage)
          .field('login', 'jane')
          .field('email', 'jane@gmail.com')
          .field('fullName', registrationData.fullName)
          .field('birthday', registrationData.birthday)
          .field('phoneNumber', '380997105162')
          .field('password', registrationData.password)
          .field('passwordConfirm', registrationData.passwordConfirm)
          .expect(400);

      expect(response.body).toHaveProperty('message', 'User with this data already exists');
   });
   test('User registration with empty data', async() => {
       const response = await request(app)
           .post('/api/user/registration')
           .attach('userImage', '')
           .field('login', '')
           .field('email', '')
           .field('fullName', '')
           .field('birthday', '')
           .field('phoneNumber', '')
           .field('password', '')
           .field('passwordConfirm', '')
           .expect(400);

       expect(response.body).toHaveProperty('message');
       let errors = response.body.message.errors;
       expect(errors).toEqual(expect.arrayContaining([
           {
               'type': 'field',
                'value': '',
                'msg': 'Please enter the login',
                'path': 'login',
                'location': 'body'
           },
           {
               'type': 'field',
               'value': '',
               'msg': 'Please enter your email',
               'path': 'email',
               'location': 'body'
           },
           {
               'type': 'field',
               'value': '',
               'msg': 'Please enter your full name',
               'path': 'fullName',
               'location': 'body'
           },
           {
               'type': 'field',
               'value': '',
               'msg': 'Please enter your birthday',
               'path': 'birthday',
               'location': 'body'
           },
           {
               'type': 'field',
               'value': '',
               'msg': 'Please enter your phone number',
               'path': 'phoneNumber',
               'location': 'body'
           },
           {
               'type': 'field',
               'value': '',
               'msg': 'Please enter password',
               'path': 'password',
               'location': 'body'
           }
       ]));
   });
   test('User registration with too small login, not correct email, not correct full name, ' +
       'not correct birthday, not correct phone number, not correct password', async () => {
       const response = await request(app)
           .post('/api/user/registration')
           .attach('userImage', registrationData.userImage)
           .field('login', 'tes')
           .field('email', 'test')
           .field('fullName', 'test')
           .field('birthday', 'test')
           .field('phoneNumber', 'test')
           .field('password', 'ukrainuser24')
           .field('passwordConfirm', 'ukrainuser24')
           .expect(400);

       expect(response.body).toHaveProperty('message');
       let errors = response.body.message.errors;
       expect(errors).toEqual(expect.arrayContaining([
           {
               type: 'field',
               value: 'tes',
               msg: 'Login must be from 4 to 35 letters',
               path: 'login',
               location: 'body'
           },
           {
               type: 'field',
               value: 'test',
               msg: 'Please enter a correct email',
               path: 'email',
               location: 'body'
           },
           {
               type: 'field',
               value: 'test',
               msg: 'Your name must consist of two words',
               path: 'fullName',
               location: 'body'
           },
           {
               type: 'field',
               value: 'test',
               msg: 'Please enter a valid birthday',
               path: 'birthday',
               location: 'body'
           },
           {
               type: 'field',
               value: 'test',
               msg: 'Please enter your phone number',
               path: 'phoneNumber',
               location: 'body'
           },
           {
               type: 'field',
               value: 'ukrainuser24',
               msg: 'Password must contain at least 8 symbols, 1 upper case symbol and 1 special symbol',
               path: 'password',
               location: 'body'
           }
       ]));
   });
   test('User registration with too big login, too small phone number, ' +
       'not correct confirm password', async () => {

       const response = await request(app)
           .post('/api/user/registration')
           .attach('userImage', registrationData.userImage)
           .field('login', 'TestUserTestUserTestUserTestUserTestUser')
           .field('email', 'test@gmail.com')
           .field('fullName', 'Test User')
           .field('birthday', '2004-05-02')
           .field('phoneNumber', '123456')
           .field('password', 'ukrainUser24$')
           .field('passwordConfirm', 'ukrainuser24')
           .expect(400);

       expect(response.body).toHaveProperty('message');
       let errors = response.body.message.errors;
       expect(errors).toEqual(expect.arrayContaining([
           {
               "location": "body",
               "msg": "Login must be from 4 to 35 letters",
               "path": "login",
               "type": "field",
               "value": "TestUserTestUserTestUserTestUserTestUser"
           },
           {
               "location": "body",
               "msg": "Phone number must be from 7 to 15 symbols",
               "path": "phoneNumber",
               "type": "field",
               "value": "123456"
           },
           {
               "location": "body",
               "msg": "Password not equal to confirm password",
               "path": "passwordConfirm",
               "type": "field",
               "value": "ukrainuser24"
           }
       ]));
   });
    test('User registration with not correct login', async () => {
        const response = await request(app)
            .post('/api/user/registration')
            .attach('userImage', registrationData.userImage)
            .field('login', 'testUserівф')
            .field('email', 'test@gmail.com')
            .field('fullName', 'Test User')
            .field('birthday', '2004-05-02')
            .field('phoneNumber', '380997105162312')
            .field('password', 'ukrainUser24$')
            .field('passwordConfirm', 'ukrainUser24$')
            .expect(400);

        expect(response.body).toHaveProperty('message');
        let errors = response.body.message.errors;
        expect(errors).toEqual(expect.arrayContaining([
            {
                "location": "body",
                "msg": "Login must contain only Latin symbols",
                "path": "login",
                "type": "field",
                "value": "testUserівф"
            }
        ]));
    });
    test('Successful user registration', async () => {

        await request(app)
            .post('/api/user/registration')
            .attach('userImage', registrationData.userImage)
            .field('login', registrationData.login)
            .field('email', registrationData.email)
            .field('fullName', registrationData.fullName)
            .field('birthday', registrationData.birthday)
            .field('phoneNumber', registrationData.phoneNumber)
            .field('password', registrationData.password)
            .field('passwordConfirm', registrationData.passwordConfirm)
            .expect(200);


        const user = await User.findOne({where: {login: registrationData.login}});
        const birthday = new Date(user.birthday);
        const formattedBirthday = birthday.toISOString().split('T')[0];
        let roles = [];
        roles = await getUserRoles(user, roles);

        //expect(roles).toEqual(['user']);
        expect(user).toBeDefined();
        expect(user.login).toEqual(registrationData.login);
        expect(user.email).toEqual(registrationData.email);
        expect(user.full_name).toEqual(registrationData.fullName);
        expect(formattedBirthday).toEqual(registrationData.birthday);
        expect(user.phone_number).toEqual(registrationData.phoneNumber);
        expect(bcrypt.compareSync(registrationData.password, user.hashed_password)).toBeTruthy();
        expect(user.user_image).toBeDefined();
    });
});