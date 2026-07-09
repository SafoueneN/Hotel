require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const createEurekaClient = require('./config/eureka');
const fetchRemoteConfig = require('./config/configServer');
const runtimeConfig = require('./config/runtimeConfig');
const { connectRabbitMQ } = require('./config/rabbitmq');
const paiementRoutes = require('./routes/paiementRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'payment-service' });
});

app.get('/info', (req, res) => {
  res.json({ service: 'payment-service', ...runtimeConfig });
});

app.use('/api/paiements', paiementRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 8082;

async function demarrer() {
  try {
    const config = await fetchRemoteConfig();
    if (config['app.hotelbook.nom-plateforme']) {
      runtimeConfig.nomPlateforme = config['app.hotelbook.nom-plateforme'];
    }
    if (config['paiement.taux-succes-simulation'] !== undefined) {
      runtimeConfig.tauxSuccesSimulation = Number(config['paiement.taux-succes-simulation']);
    }
    console.log('[payment-service] Configuration récupérée depuis config-server :', runtimeConfig);
  } catch (err) {
    console.warn('[payment-service] Config-server injoignable, utilisation des valeurs par défaut', err.message);
  }

  await connectDB();

  try {
    await connectRabbitMQ();
  } catch (err) {
    console.warn('[payment-service] RabbitMQ injoignable au démarrage, nouvelle tentative au premier paiement', err.message);
  }

  app.listen(PORT, () => {
    console.log(`[payment-service] Démarré sur le port ${PORT}`);

    const eurekaClient = createEurekaClient(PORT);
    eurekaClient.start((error) => {
      if (error) {
        console.error('[payment-service] Échec d\'enregistrement auprès d\'Eureka', error);
      } else {
        console.log('[payment-service] Enregistré auprès d\'Eureka');
      }
    });
  });
}

demarrer().catch((err) => {
  console.error('[payment-service] Échec du démarrage', err);
  process.exit(1);
});
