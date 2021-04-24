const PackController = require('../packs/controllers/packs.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const NORMAL = config.permissionLevels.NORMAL_USER;

module.exports.routesConfig = function(app) {
    app.post('/pack/create', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        PackController.create,
    ]);
    app.get('/pack/:packId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        PackController.getById,
    ]);
    app.patch('/pack/edit', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        PackController.patchById,
    ]);
    app.delete('/pack/delete/:packId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        // something like PackController.removeById,
    ]);
};