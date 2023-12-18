export default class ShelterStore {
    constructor() {
        this._shelter = {}
    }

    setShelter(shelter){
        this._shelter = shelter;
    }

    getShelter(){
        return this._shelter;
    }
}