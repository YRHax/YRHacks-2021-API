const fs = require('fs');
const uploadFile = require('../middlewares/upload.files');

module.exports.upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if(req.file == undefined) {
            return res.status(400).send({ errors: 'Please choose a file to upload!' });
        }

        res.status(200).send({
            message: 'Uploaded the file successfully: ' + req.file.originalname,
        });
    } catch(err) {
        if(err.code == 'LIMIT_FILE_SIZE') {
            return res.status(404).send({
                errors: 'File size cannot be larger than 256KB!',
            });
        }

        if(err.code == 'LIMIT_UNEXPECTED_FILE') {
            return res.status(404).send({
                errors: 'No more than 50 files can be uploaded at once!',
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

module.exports.getListOfFiles = (_req, res) => {
    const directoryPath = __dirname + '/uploads/';

    fs.readdir(directoryPath, function(err, files) {
        if(err) {
            res.status(500).send({
                errors: err,
            });
        }

        const fileInfo = [];

        files.forEach((file) => {
            fileInfo.push({
                name: file,
            });
        });

        res.status(200).send(fileInfo);
    });
};

module.exports.download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __dirname + '/uploads/';

    res.download(directoryPath + fileName, fileName, (err) => {
        if(err) {
            res.status(500).send({
                errors: 'Could not download the file: ' + err,
            });
        }
    });
};