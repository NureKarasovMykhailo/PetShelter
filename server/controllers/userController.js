const {User, Role, UserRole} = require('../models/models');
const {Sequelize} = require("sequelize");
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

class UserController {
    async subscriberRegistration(req, res) {
        try {
            const {login, userImage, email, fullName,
                birthday, phoneNumber, password} = req.body;

            const candidate = await User.findOne({
                where: {
                    [Sequelize.Op.or]: [
                        {login: login},
                        {email: email},
                        {phone_number: phoneNumber}
                    ]
                }
            });
            if (candidate){
                return res.status(400).json({message: 'User with this data already exists'});
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return res.status(400).json(errors)
            }

            const hashedPassword = bcrypt.hashSync(password, 7);
            const user = await User.create({
                login: login,
                user_image: userImage,
                email: email,
                full_name: fullName,
                birthday: birthday,
                phone_number: phoneNumber,
                date_of_registration: Date.now(),
                hashed_password: hashedPassword,
                is_paid: false
            });
            const role = await Role.findOne({
                where: {
                    role_title: 'subscriber'
                }
            })

            const userRole = UserRole.create({
                userId: user.id,
                roleId: role.id
            });
            return res.status(200).json({message: 'OK'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
    }

    async authorization(req, res) {
        try {

        } catch (e) {
            res.status(400).json({message: 'Authorization error'});

        }
    }

    async check (req, res) {
        try {

        } catch (e) {

        }
    }
}

module.exports = new UserController();