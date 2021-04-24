const FileController = require('../emojis/controllers/file.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const NORMAL = config.permissionLevels.NORMAL_USER;

module.exports.routesConfig = async function(app) {
    app.post('/pack/upload/:packId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        FileController.upload,
    ]);
};