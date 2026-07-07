require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const paiementRoutes = require('./routes/paiementRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'payment-service' });
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

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[payment-service] Démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[payment-service] Échec de connexion à MongoDB', err);
    process.exit(1);
  });
