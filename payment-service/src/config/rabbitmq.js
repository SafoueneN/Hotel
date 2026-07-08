const amqp = require('amqplib');

const EXCHANGE = 'hotelbook.exchange';
const ROUTING_KEY_PAIEMENT_REUSSI = 'paiement.reussi';

let channel = null;

async function connectRabbitMQ() {
  const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  const connection = await amqp.connect(url);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  console.log(`[payment-service] Connecté à RabbitMQ : ${url}`);
}

function publierPaiementReussi(reservationId) {
  if (!channel) {
    console.warn('[payment-service] RabbitMQ non connecté, événement paiement.reussi non publié');
    return;
  }
  const payload = Buffer.from(JSON.stringify({ reservationId }));
  channel.publish(EXCHANGE, ROUTING_KEY_PAIEMENT_REUSSI, payload, { contentType: 'application/json' });
  console.log(`[payment-service] Événement 'paiement.reussi' publié pour la réservation ${reservationId}`);
}

module.exports = { connectRabbitMQ, publierPaiementReussi };
