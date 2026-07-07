const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/paymentdb';
  await mongoose.connect(uri);
  console.log(`[payment-service] Connecté à MongoDB : ${uri}`);
}

module.exports = connectDB;
