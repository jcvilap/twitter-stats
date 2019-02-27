const computeStats = require('./../services/compute-stats');

module.exports = {
  method: 'get',
  path: '/report',
  handler: [
    async (ctx) => {
      const stats = computeStats();

      ctx.body = stats;
      ctx.status = 200;
    },
  ],
};