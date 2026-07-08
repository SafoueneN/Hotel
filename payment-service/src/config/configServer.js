const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Config server a répondu ${res.statusCode}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

// Fusionne les propertySources renvoyées par Spring Cloud Config Server
// (la première source a la priorité la plus haute)
function flattenPropertySources(propertySources) {
  const merged = {};
  for (let i = propertySources.length - 1; i >= 0; i--) {
    Object.assign(merged, propertySources[i].source);
  }
  return merged;
}

async function fetchRemoteConfig() {
  const host = process.env.CONFIG_SERVER_URL || 'http://localhost:8888';
  const url = `${host}/payment-service/default`;

  const json = await fetchJson(url);
  return flattenPropertySources(json.propertySources || []);
}

module.exports = fetchRemoteConfig;
