require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const fileUpload = require('express-fileupload');
const path = require('path');
const transporter = require('./nodemailerConfig');
const https = require("https");
const fs = require('fs')

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
        app.listen(PORT, () => console.log(`Secure server started on port ${PORT}`));
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log(e);
    }
}

if (process.env.NODE_ENV !== 'test') {
    start().then(r => console.log('Database created'));
}



module.exports.app = app;