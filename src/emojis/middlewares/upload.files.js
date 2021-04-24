const util = require('util');
const multer = require('multer');
const maxSize = 256 * 1024;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, __dirname + '/uploads/');
    },
    filename: (_req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    },
});

const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: maxSize,
    },
}).array('multi-files', 50);

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;