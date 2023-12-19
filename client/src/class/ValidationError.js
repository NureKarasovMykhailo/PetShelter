export default class ValidationError {
    constructor(msg, path, type, location) {
        this.msg = msg || '';
        this.path = path || '';
        this.type = type || '';
        this.location = location || '';
    }
}

