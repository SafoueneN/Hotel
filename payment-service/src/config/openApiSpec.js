const montantSchema = { type: 'number', example: 900 };

const paiementSchema = {
  type: 'object',
  properties: {
    reservationId: { type: 'integer', example: 1 },
    clientEmail: { type: 'string', example: 'ali@hotelbook.local' },
    montant: montantSchema,
    methode: { type: 'string', enum: ['CARTE', 'VIREMENT', 'ESPECES'] },
    statut: { type: 'string', enum: ['REUSSI', 'ECHOUE'] },
  },
};

const notificationSchema = {
  type: 'object',
  properties: {
    destinataire: { type: 'string', example: 'ali@hotelbook.local' },
    reservationId: { type: 'integer', example: 1 },
    sujet: { type: 'string' },
    message: { type: 'string' },
    envoyee: { type: 'boolean' },
  },
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'HotelBook — payment-service',
    description: 'Paiements et notifications (Node.js/Express + MongoDB)',
    version: 'v1',
  },
  paths: {
    '/api/paiements': {
      get: {
        tags: ['Paiements'],
        summary: 'Lister les paiements',
        responses: { 200: { description: 'Liste des paiements' } },
      },
      post: {
        tags: ['Paiements'],
        summary: 'Créer un paiement',
        requestBody: {
          content: { 'application/json': { schema: paiementSchema } },
        },
        responses: { 201: { description: 'Paiement créé' } },
      },
    },
    '/api/paiements/stats': {
      get: {
        tags: ['Paiements'],
        summary: 'Statistiques agrégées des paiements (par statut, par méthode)',
        responses: { 200: { description: 'Statistiques' } },
      },
    },
    '/api/paiements/reservation/{reservationId}': {
      get: {
        tags: ['Paiements'],
        summary: "Lister les paiements d'une réservation",
        parameters: [{ name: 'reservationId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Liste des paiements de la réservation' } },
      },
    },
    '/api/paiements/reservation/{reservationId}/payer': {
      post: {
        tags: ['Paiements'],
        summary: "Payer une réservation — appel synchrone vers reservation-service puis confirmation asynchrone via RabbitMQ",
        parameters: [{ name: 'reservationId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { methode: { type: 'string' } } } } },
        },
        responses: {
          201: { description: 'Paiement traité (succès ou échec simulé)' },
          404: { description: 'Réservation introuvable' },
          409: { description: 'Réservation déjà traitée' },
        },
      },
    },
    '/api/paiements/{id}': {
      get: {
        tags: ['Paiements'],
        summary: 'Obtenir un paiement par id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Paiement' }, 404: { description: 'Introuvable' } },
      },
      put: {
        tags: ['Paiements'],
        summary: 'Modifier un paiement',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Paiement modifié' } },
      },
      delete: {
        tags: ['Paiements'],
        summary: 'Supprimer un paiement',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Supprimé' } },
      },
    },
    '/api/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Lister les notifications',
        responses: { 200: { description: 'Liste des notifications' } },
      },
      post: {
        tags: ['Notifications'],
        summary: 'Créer une notification',
        requestBody: { content: { 'application/json': { schema: notificationSchema } } },
        responses: { 201: { description: 'Notification créée' } },
      },
    },
    '/api/notifications/{destinataire}': {
      get: {
        tags: ['Notifications'],
        summary: "Lister les notifications d'un destinataire",
        parameters: [{ name: 'destinataire', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: "Notifications du destinataire" } },
      },
    },
  },
  components: {
    schemas: { Paiement: paiementSchema, Notification: notificationSchema },
  },
};
