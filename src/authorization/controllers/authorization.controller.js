const jwtSecret = require('../../common/config/env.config.js').jwt_secret;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports.login = (req, res) => {
    try {
        const refreshId = req.body.userId + jwtSecret;
        const salt = crypto.randomBytes(16).toString('base64');
        const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
        req.body.refreshKey = salt;

        const token = jwt.sign(req.body, jwtSecret);
        const b = Buffer.from(hash);
        const refresh_token = b.toString('base64');
        res.status(201).send({ id: req.body.userId, accessToken: token, refreshToken: refresh_token });
    } catch(err) {
        res.status(500).send({ errors: err });
    }
};

module.exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        const token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({ id: token });
    } catch (err) {
        res.status(500).send({ errors: err });
    }
};