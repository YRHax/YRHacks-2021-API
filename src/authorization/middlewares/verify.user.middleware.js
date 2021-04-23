const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');

module.exports.hasAuthValidFields = (req, res, next) => {
    const errors = [];

    if(req.body) {
        if(!req.body.username) {
            errors.push('Missing username field');
        }

        if(!req.body.password) {
            errors.push('Missing password field');
        }

        if(errors.length) {
            return res.status(400).send({ errors: errors.join(', ') });
        } else {
            return next();
        }
    } else {
        return res.status(400).send({ errors: 'Missing username and password fields' });
    }
};

module.exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByUsername(req.body.username).then((user) => {
        if(!user[0]) {
            res.status(401).send({
                // send nothing
            });
        } else {
            const passwordFields = user[0].password.split('$');
            const salt = passwordFields[0];
            const hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');

            if(hash === passwordFields[1]) {
                req.body = {
                    userId: user[0]._id,
                    permissionLevel: user[0].permissionLevel,
                    provider: 'email',
                    name: user[0].username,
                };

                return next();
            } else {
                return res.status(400).send({ errors: ['Invalid username or password'] });
            }
        }
    });
};