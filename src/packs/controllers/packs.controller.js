const packModel = require('../../users/models/packs.model');

module.exports.create = (req, res) => {
    if(!req.body.name || !req.body.owner) {
        return res.status(404).send({ errors: 'Missing name and/or owner fields' });
    }

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
    if(req.body.newName) {
        req.body.name = req.body.newName;
    }

    if(req.body.newVisibility) {
        req.body.visibility = req.body.newVisibility;
    }

    packModel.patchPack(req.body.id, req.body).then(() => {
        res.status(204).send({
            // send nothing
        });
    });
};

module.exports.removeById = (req, res) => {
    packModel.removeById(req.params.packId).then(() => {
        res.status(204).send({
            // send nothing
        });
    });
};

module.exports.cloneById = async (req, res) => {
    packModel.cloneById(req.body.srcId).then((result) => {
        res.status(204).send({ id: result._id });
    });
};