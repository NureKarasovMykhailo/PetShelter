const {User, UserRole, Role} = require('../models/models');
const {Sequelize} = require("sequelize");
const getUserRole = require("../middleware/getUserRoles");
const generateJwt = require("../functions/generateJwt");

const ROLES = {
    USER: 'user',
};

class UserService {
    async changeUsersDomain (shelterId, oldDomain, newDomain) {
        let shelterUsers = await User.findAll({where: {shelterId}});
        const regex = new RegExp(`${oldDomain}\\b`, 'g');
        await Promise.all(shelterUsers.map(async shelterUser => {
            let domainEmail = shelterUser.domain_email;
            shelterUser.domain_email = domainEmail.replace(regex, `${newDomain}`);
            await shelterUser.save();
        }));
    }

    async checkUserDuplicates(login, email, phoneNumber){
        const candidates = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { login: login },
                    { email: email },
                    { phone_number: phoneNumber }
                ]
            }
        });
        return candidates === null;
    }

    async assignUserRoles(userId){
        const role = await Role.findOne({
            where: {
                role_title: ROLES.USER
            }
        });

        await UserRole.create({
            userId,
            roleId: role.id
        });
    }

    async setSubscriberId (userId, subscriptionId) {
        const user = await User.findOne({where: {id: userId}});
        user.subscriptionId = subscriptionId;
        const userRole = await getUserRole(user);
        if (!userRole.includes('subscriber')){
            const subscriptionRole = await Role.findOne({where: {role_title: 'subscriber'}});
            await UserRole.create({userId: user.id, roleId: subscriptionRole.id});
        }
        await user.save();
    }

    async isEmailExist(newEmail) {
        const candidate = await User.findOne({ where: { email: newEmail } });
        return candidate !== null;
    }

    async applyUserChanges(user){
        await user.save();
        const roles = await getUserRole(user);
        const newToken = await generateJwt(
            user.id,
            user.login,
            user.user_image,
            user.domain_email,
            user.email,
            user.full_name,
            user.birthday,
            user.phone_number,
            user.is_paid,
            user.shelterId,
            roles
        );
        return {user: user, token: newToken};
    }

    async isNumberExist(newPhoneNumber){
        const candidate = await User.findOne({where: {phone_number: newPhoneNumber}});
        return !candidate === null;
    }

}

module.exports = new UserService();