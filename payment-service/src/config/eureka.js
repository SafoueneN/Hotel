const { Eureka } = require('eureka-js-client');

function createEurekaClient(port) {
  return new Eureka({
    instance: {
      app: 'payment-service',
      instanceId: `payment-service:${port}`,
      hostName: 'localhost',
      ipAddr: '127.0.0.1',
      port: { $: port, '@enabled': true },
      vipAddress: 'payment-service',
      statusPageUrl: `http://localhost:${port}/health`,
      healthCheckUrl: `http://localhost:${port}/health`,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      host: process.env.EUREKA_HOST || 'localhost',
      port: process.env.EUREKA_PORT || 8761,
      servicePath: '/eureka/apps/',
    },
  });
}

module.exports = createEurekaClient;
