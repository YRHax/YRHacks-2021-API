const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const packSchema = new Schema({
    name: String,
    owner: String,
    views: {
        type: Number,
        default: 0,
    },
    emojis: [],
    visibility: {
        type: Boolean,
        default: false,
    },
});

packSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

packSchema.set('toJSON', {
    virtuals: true,
});

packSchema.findById = function(cb) {
    return this.model('Packs').find({ id: this.id }, cb);
};

const Pack = mongoose.model('Packs', packSchema);

module.exports.findByName = (packname) => {
    return Pack.find({ name: packname });
};

module.exports.findById = async (packID) => {
    return Pack.findById(packID).then((result) => {
        result = result.toJSON();
        delete result._id;
        delete result.__v;
        return result;
    });
};

module.exports.createPack = (packData) => {
    const pack = new Pack(packData);
    return pack.save();
};

module.exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Pack.find().limit(perPage).skip(perPage * page).exec(function(err, packs) {
            if(err) {
                reject(err);
            } else {
                resolve(packs);
            }
        });
    });
};

module.exports.patchPack = (packID, packData) => {
    return Pack.findOneAndUpdate({
        _id: packID,
    }, packData);
};

module.exports.removeById = (packID) => {
    return new Promise((resolve, reject) => {
        Pack.deleteMany({ _id: packID }, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};