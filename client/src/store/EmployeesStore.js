import {makeAutoObservable} from 'mobx';

export default class EmployeesStore {

    constructor() {
        this._roles = [];
        this._employees = [];
        makeAutoObservable(this);
    }

    setRoles (roles) {
        this._roles = roles;
    }

    setEmployees (employees) {
        this._employees = employees;
    }

    getRoles(){
        return this._roles;
    }

    getEmployees() {
        return this._employees;
    }
}