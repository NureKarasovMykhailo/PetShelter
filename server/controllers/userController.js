const {User, Role, UserRole} = require('../models/models');
const {Sequelize} = require("sequelize");
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const path = require('path');


const generateJwt = async (id, login, image, domainEmail, email, fullName,
                           birthday, phoneNumber, isPaid, shelterId) => {

    try {
        const userRoles = await UserRole.findAll({ where: { userId: id } });
        const roles = [];

        await Promise.all(userRoles.map(async (userRole) => {
            const role = await Role.findOne({ where: { id: userRole.roleId } });
            roles.push(role.role_title);
        }));

        const token = jwt.sign(
            {
                id: id,
                login: login,
                user_image: image,
                domain_email: domainEmail,
                email: email,
                full_name: fullName,
                birthday: birthday,
                phone_number: phoneNumber,
                is_paid: isPaid,
                shelterId: shelterId,
                roles: roles
            },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        return token;
    } catch (e) {
        return ApiError.internal('Server error while generating JWT token');
    }
}

class UserController {
    async userRegistration(req, res, next) {
        try {
            const {login, email, fullName,
                birthday, phoneNumber, password} = req.body;
            let userImageName;
            let userImage;
            if (!req.files || Object.keys(req.files).length === 0) {
                userImageName = 'default-user-image.jpg';
            } else {
                userImage = req.files.userImage;
                userImageName = uuid.v4() + '.jpg';
            }
            const candidates = await User.findOne({
                where: {
                    [Sequelize.Op.or]: [
                        {login: login},
                        {email: email},
                        {phone_number: phoneNumber}
                    ]
                }
            });
            if (candidates){
                return next(ApiError.badRequest('User with this data already exists'));
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            const hashedPassword = bcrypt.hashSync(password, 7);
            const user = await User.create({
                login: login,
                user_image: userImageName,
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
            if (userImageName !== 'default-user-imag.jpg') {
                await userImage.mv(path.resolve(__dirname, '..', 'static', userImageName));
            }
            return res.status(200).json({message: 'User successfully created'});
        } catch (e) {
            console.log(e);
            return next(ApiError.internal('Server Error while registration'));
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
            const token = await generateJwt(
                user.id,
                user.login,
                user.user_image,
                user.domain_email,
                user.email,
                user.full_name,
                user.birthday,
                user.phone_number,
                user.is_paid,
                user.shelterId
            );
            return res.json({token});

        } catch (e) {
            return next(ApiError.internal('Server error while authorization'));
        }
    }

    async check (req, res, next) {
        try {
            const user = req.user;
            const token = await generateJwt(
                user.id,
                user.login,
                user.user_image,
                user.domain_email,
                user.email,
                user.full_name,
                user.birthday,
                user.phone_number,
                user.is_paid,
                user.shelterId
            );
            return res.json({token});
        } catch (e) {
            return next(ApiError.internal('Server error'));
        }
    }
}

module.exports = new UserController();