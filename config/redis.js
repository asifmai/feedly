const redisCache = require('rediscache');

module.exports = () => new Promise(async (resolve, reject) => {
  try {
    await redisCache.connect(process.env.REDIS_PORT, process.env.REDIS_IP, process.env.REDIS_PASSWORD)
      .configure({
        expiry: process.env.REDIS_CACHE_EXPIRY,
      });
    redisCache.client.on('connect', function () {
      console.log('Redis Server connected...');
      resolve(true);
    });
  } catch (error) {
    console.error('Redis Server connection failed: ', error.stack);
    reject(error);
  };
});