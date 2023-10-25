const {UserRole, Role} = require("../models/models");


module.exports = async (user) => {
    let userRoles = await UserRole.findAll({where: {userId: user.id}});
    let rolesTitles = [];
    await Promise.all(userRoles.map(async userRole => {
        let role = await Role.findOne({where: {id: userRole.roleId}});
        rolesTitles.push(role.role_title);
    }));
    return rolesTitles;
}