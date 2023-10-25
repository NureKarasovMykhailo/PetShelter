class ShelterController {

    async create(req, res, next) {
        const {
            shelterName,
            shelterAddress,
            shelterDomain,
        } = req.body;
        const {shelterImage} = req.files;


    }

    async get(req, res, next) {

    }

    async update(req, res, next) {

    }

    async delete(req, res, next){

    }


}

module.exports = new ShelterController();