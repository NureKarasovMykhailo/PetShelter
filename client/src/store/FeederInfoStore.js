import {makeAutoObservable} from 'mobx';

export default class FeederInfoStore {

    constructor() {
        this._feederInfo = [];
        makeAutoObservable(this);
    }


    setFeederInfo (feederInfo) {
        this._feederInfo = feederInfo;
    }

    getFeederInfo(){
        return this._feederInfo;
    }
}