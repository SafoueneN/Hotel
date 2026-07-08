const http = require('http');

function fetchReservation(reservationId) {
  const baseUrl = process.env.RESERVATION_SERVICE_URL || 'http://localhost:8081';

  return new Promise((resolve, reject) => {
    http
      .get(`${baseUrl}/api/reservations/${reservationId}`, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode === 404) {
            return resolve(null);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`reservation-service a répondu ${res.statusCode}`));
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

module.exports = { fetchReservation };
