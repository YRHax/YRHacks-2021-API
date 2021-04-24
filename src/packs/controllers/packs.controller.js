const packModel = require('../../users/models/packs.model');

module.exports.create = (req, res) => {
    req.body.name = req.params.name;

    packModel.createPack(req.body).then((result) => {
        res.status(201).send({ id: result._id });
    });
};