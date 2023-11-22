require('dotenv').config();
const express = require('express');
const dataBase = require('./classes/DataBase');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const fileUpload = require('express-fileupload');
const path = require('node:path');
const {static} = require("express");
const models = require('./models/models');

const PORT = process.env.PORT || 5000;
const app = express();



app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// last middleware
app.use(errorHandler);


const start = async() => {
    try {
        await dataBase.db.authenticate();
        await dataBase.db.sync();
    } catch (e) {
        console.log(e);
    }
}

if (process.env.NODE_ENV !== 'test') {
    start().then(() => console.log('Database created'));
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



}



module.exports.app = app;