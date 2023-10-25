const fs = require('node:fs');
const path = require('node:path');

module.exports = (imageName) => {
    fs.unlink(
        path.resolve(__dirname, '../../static/', imageName),
        (err
        ) => {
            if (err) {
                console.error(`Error while deleting file: ${err}`);
            } else {
                console.log(`File ${path} successfully deleted`);
            }
        }
    );
};