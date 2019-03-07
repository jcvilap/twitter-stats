const Koa = require('koa');
const router = require('../routes');
const tweeterService = require('../services/tweeter-service');

const PORT = 8011;

async function main() {
  try {
    const app = new Koa();
    app.use(router);

    await app.listen(PORT);
    console.info(`app: listening on port ${PORT}`);

    tweeterService.initStream();

    return app;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = main();