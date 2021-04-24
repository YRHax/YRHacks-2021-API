const packModel = require('../../users/models/packs.model');

module.exports.create = (req, res) => {
    req.body.name = req.params.name;
    req.body.owner = req.params.userId;

    packModel.createPack(req.body).then((result) => {
        res.status(201).send({ id: result._id });
    });
};

module.exports.getById = (req, res) => {
    packModel.findById(req.params.packId).then((result) => {
        res.status(200).send(result);
    });
};

module.exports.patchById = (req, res) => {
    if(req.params.newName) {
        req.body.name = req.params.newName;
    }

    if(req.params.newVisibility) {
        req.body.visibility = req.params.newVisibility;
    }

    packModel.patchPack(req.params.packId, req.body).then(() => {
        res.status(204).send({
            // send nothing
        });
    });
};