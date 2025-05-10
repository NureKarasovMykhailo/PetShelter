import {makeAutoObservable} from 'mobx';

export default class PetsStore {

    constructor() {
        this._pet = [];
        this._kinds = [];
        this._onePet = {};
        this._petInfo = [{}];
        makeAutoObservable(this);
    }

    setPets (pets) {
        this._pet = pets;
    }

    getPets(){
        return this._pet;
    }

    setKinds (kinds) {
        this._kinds = kinds;
    }

    getKinds(){
        return this._kinds;
    }

    setOnePet (pet) {
        this._onePet = pet;
    }

    getOnePet(){
        return this._onePet;
    }

    setPetInfo(petInfo) {
        this._petInfo = petInfo;
    }

    getPetInfo(petInfo) {
        return this._petInfo;
    }
}