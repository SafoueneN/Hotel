const { Eureka } = require('eureka-js-client');

function createEurekaClient(port) {
  const hostName = process.env.EUREKA_INSTANCE_HOSTNAME || 'localhost';

  return new Eureka({
    instance: {
      app: 'payment-service',
      instanceId: `payment-service:${port}`,
      hostName,
      ipAddr: hostName,
      port: { $: port, '@enabled': true },
      vipAddress: 'payment-service',
      statusPageUrl: `http://${hostName}:${port}/health`,
      healthCheckUrl: `http://${hostName}:${port}/health`,
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
