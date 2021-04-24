const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const packSchema = new Schema({
    name: {
        type: String,
    },
    owner: {
        type: String,
    },
    packCopyCount: {
        type: Number,
        default: 0,
    },
    emojis: [{
        emojiId: {
            type: String,
        },
        emojiName: {
            type: String,
        },
        pack: {
            type: String,
        },
        owner: {
            type: String,
        },
        copyCount: {
            type: Number,
            default: 0,
        },
    }],
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

function cleanId(obj) {
    if(obj != null && typeof (obj) != 'string' && typeof (obj) != 'number' && typeof (obj) != 'boolean') {
        if(typeof (obj.length) == 'undefined') {
            delete obj._id;
            for(const key in obj) {
                cleanId(obj[key]);
            }
        } else {
            for(let i = 0; i < obj.length; i++) {
                cleanId(obj[i]);
            }
        }
    }
}

const Pack = mongoose.model('Packs', packSchema);

module.exports.findByName = (packname) => {
    return Pack.find({ name: packname });
};

module.exports.findById = (packID) => {
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

module.exports.cloneById = async (packID, newPackOwner) => {
    const old_doc = Pack.findOne({ _id: packID });
    const new_doc_with_ids = (await old_doc).toJSON();
    new_doc_with_ids.owner = newPackOwner;
    const new_doc_without_ids = cleanId(new_doc_with_ids);
    const new_doc = new Pack(new_doc_without_ids);
    new_doc.isNew = true;
    return new_doc.save().then((result) => {
        return result._id;
    });
};