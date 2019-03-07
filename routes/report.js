const tweeterService = require('./../services/tweeter-service');

module.exports = {
  method: 'get',
  path: '/report',
  handler: [
    async (ctx) => {
      ctx.body = await tweeterService.generateStats();
      ctx.status = 200;
    },
  ],
};