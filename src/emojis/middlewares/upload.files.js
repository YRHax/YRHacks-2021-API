const util = require('util');
const multer = require('multer');
const packModel = require('../../users/models/packs.model');
const maxSize = 256 * 1024;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, __dirname + '/uploads/');
    },
    filename: async (req, file, cb) => {
        const name = `${Date.now()}-${file.originalname}`;
        console.log(file.originalname);

        const model = await packModel.findById(req.params.packId);
        model.updateOne({
            emojis: [{
                emojiName: name,
                pack: req.params.packId,
            }],
        });
        await model.save();

        cb(null, name);
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