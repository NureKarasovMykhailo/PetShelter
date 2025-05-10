const {User, Shelter} = require("../models/models");

module.exports = async (requestedUserId) => {
    const requestedUser = await User.findOne({
        where: {id: requestedUserId}
    });
    return await Shelter.findOne({
        where: {id: requestedUser.shelterId}
    });
}