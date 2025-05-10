import {makeAutoObservable} from 'mobx';

export default class FeederStore {

    constructor() {
        this._feeder = [];
        makeAutoObservable(this);
    }


    setFeeder (feeder) {
        this._feeder = feeder;
    }

    getFeeder(){
        return this._feeder;
    }
}