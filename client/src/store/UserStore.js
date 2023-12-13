import {makeAutoObservable} from 'mobx';

export default class UserStore {

    constructor() {
        this._isAuth = false;
        this._user = {};
        this._subscription = {};
        makeAutoObservable(this);
    }

    setIsAuth(isAuth) {
        this._isAuth = isAuth;
    }

    setUser(user) {
        this._user = user;
    }

    setSubscription(subscription) {
        this._subscription = subscription;
    }

    get isAuth(){
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get getSubscription() {
        return this._subscription;
    }
}