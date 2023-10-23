const {User, Role, UserRole} = require('../models/models');
const {Sequelize} = require("sequelize");
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');

class UserController {
    async userRegistration(req, res, next) {
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
                return next(ApiError.badRequest('User with this data already exists'));
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
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
                    role_title: 'user'
                }
            })

            const userRole = UserRole.create({
                userId: user.id,
                roleId: role.id
            });
            return res.status(200).json({message: 'User successfully created'});
        } catch (e) {
            console.log(e);
            return next(ApiError.internal('Server Error'));
        }
    }

    async authorization(req, res, next) {
        try {
            const {login, password} = req.body;
            const user = await User.findOne({where: {login: login}});
            if (!user) {
                return next(ApiError.badRequest('Invalid login or password'));
            }
            let comparePassword = bcrypt.compareSync(password, user.hashed_password);

            if (!comparePassword) {
                return next(ApiError.badRequest('Invalid login or password'));

            }
            const token = jwt.sign(
                {
                    id: user.id,
                    login: login,
                    email: user.email,
                    phone_number: user.phone_number,
                    is_paid: user.is_paid,
                    domain_email: user.domain_email,
                    user_image: user.user_image,
                    full_name: user.full_name,
                    birthday: user.birthday,
                    shelterId: user.shelterId
                },
                process.env.SECRET_KEY,
                {expiresIn: '24h'}
            );

            return res.json({token});

        } catch (e) {
            return next(ApiError.internal('Server error'));
        }
    }

    async check (req, res) {
        try {

        } catch (e) {

        }
    }
}

module.exports = new UserController();