const Router = require('koa-joi-router');

const reportRoute = require('./report');

const routes = [reportRoute];
const router = Router();
router.prefix('/api');
router.route(routes);

module.exports = router.middleware();