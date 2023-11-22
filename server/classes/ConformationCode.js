const {ConfirmationCode} = require("../models/models");

class ConformationCode{
    constructor() {
        this.expirationTime = 15 * 60 * 1000;
        this.expiresAt = new Date(Date.now() + this.expirationTime);
    }

    async createConformationCode(conformationCode, userId){
        await ConfirmationCode.create({code: conformationCode, expiresAt: this.expiresAt, userId});
    }
}

module.exports = new ConformationCode();