const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
module.exports = generateJwt = async (
    id,
    login,
    image,
    domainEmail,
    email,
    fullName,
    birthday,
    phoneNumber,
    isPaid,
    shelterId,
    roles
) => {
    try {
        return jwt.sign(
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
            {expiresIn: '24h'}
        );
    } catch (e) {
        return ApiError.internal('Server error while generating JWT token');
    }
}