import {makeAutoObservable} from 'mobx';

export default class LanguageStore {
    constructor() {
        this._selectedLanguage = 'uk';
        makeAutoObservable(this);
    }

    setLanguage(language) {
        this._selectedLanguage  = language;
    }

    get getSelectedLanguage() {
        return this._selectedLanguage;
    }
}