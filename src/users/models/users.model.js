const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    permissionLevel: Number,
});

userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised
userSchema.set('toJSON', {
    virtuals: true,
});

userSchema.findById = function(cb) {
    return this.model('Users').find({ id: this.id }, cb);
};

const User = mongoose.model('Users', userSchema);

module.exports.findByUsername = (username) => {
    return User.find({ username: username });
};

module.exports.findById = async (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        delete result._id;
        delete result.__v;
        return result;
    });
};

module.exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

module.exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find().limit(perPage).skip(perPage * page).exec(function(err, users) {
            if(err) {
                reject(err);
            } else {
                resolve(users);
            }
        });
    });
};

module.exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id,
    }, userData);
};

module.exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteMany({ _id: userId }, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};