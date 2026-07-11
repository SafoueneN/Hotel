const amqp = require('amqplib');

const EXCHANGE = 'hotelbook.exchange';
const ROUTING_KEY_PAIEMENT_REUSSI = 'paiement.reussi';
const ROUTING_KEY_PAIEMENT_ECHOUE = 'paiement.echoue';
const ROUTING_KEY_RESERVATION_ANNULEE = 'reservation.annulee';
const QUEUE_RESERVATION_ANNULEE = 'payment.reservation.annulee.queue';

let channel = null;

async function connectRabbitMQ() {
  const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  const connection = await amqp.connect(url);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  console.log(`[payment-service] Connecté à RabbitMQ : ${url}`);
}

function publier(routingKey, payload, description) {
  if (!channel) {
    console.warn(`[payment-service] RabbitMQ non connecté, événement ${routingKey} non publié`);
    return;
  }
  channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(payload)), { contentType: 'application/json' });
  console.log(`[payment-service] Événement '${routingKey}' publié ${description}`);
}

function publierPaiementReussi(reservationId) {
  publier(ROUTING_KEY_PAIEMENT_REUSSI, { reservationId }, `pour la réservation ${reservationId}`);
}

function publierPaiementEchoue(reservationId) {
  publier(ROUTING_KEY_PAIEMENT_ECHOUE, { reservationId }, `pour la réservation ${reservationId}`);
}

// Communication asynchrone (scenario 3, sens inverse) : reservation-service publie
// "reservation.annulee", payment-service consomme et rembourse automatiquement.
async function consommerReservationAnnulee(surAnnulation) {
  if (!channel) {
    console.warn('[payment-service] RabbitMQ non connecté, écoute de reservation.annulee ignorée');
    return;
  }
  await channel.assertQueue(QUEUE_RESERVATION_ANNULEE, { durable: true });
  await channel.bindQueue(QUEUE_RESERVATION_ANNULEE, EXCHANGE, ROUTING_KEY_RESERVATION_ANNULEE);

  channel.consume(QUEUE_RESERVATION_ANNULEE, async (msg) => {
    if (!msg) return;
    try {
      const { reservationId } = JSON.parse(msg.content.toString());
      console.log(`[payment-service] Événement 'reservation.annulee' reçu pour la réservation ${reservationId}`);
      await surAnnulation(reservationId);
      channel.ack(msg);
    } catch (err) {
      console.error("[payment-service] Échec du traitement de l'événement reservation.annulee", err);
      channel.nack(msg, false, false);
    }
  });
}

module.exports = {
  connectRabbitMQ,
  publierPaiementReussi,
  publierPaiementEchoue,
  consommerReservationAnnulee,
};
