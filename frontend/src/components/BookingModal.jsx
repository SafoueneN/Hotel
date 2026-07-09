import { useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../useAuth';
import { IconCalendar } from './icons';
import { roomTypeImage } from '../utils/photos';

export default function BookingModal({ chambre, hotel, dateDebutInitiale, dateFinInitiale, onClose }) {
  const { username, email } = useAuth();
  const [dateDebut, setDateDebut] = useState(dateDebutInitiale || '');
  const [dateFin, setDateFin] = useState(dateFinInitiale || '');
  const [error, setError] = useState('');
  const [succes, setSucces] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEnvoi(true);
    try {
      await apiClient.post('/api/reservations', {
        chambreId: chambre.id,
        clientNom: username,
        clientEmail: email,
        dateDebut,
        dateFin,
      });
      setSucces(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la réservation');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <img className="modal-photo" src={roomTypeImage(chambre.type)} alt={`Chambre ${chambre.type.toLowerCase()}`} />
        <h2>Réserver</h2>
        <p className="muted">{hotel.nom} · chambre {chambre.numero} · {chambre.type}</p>
        <p className="card-price" style={{ marginTop: 8 }}>{chambre.prixParNuit} DH <small>/ nuit</small></p>

        {succes ? (
          <div>
            <p className="success">Réservation créée avec succès ! Retrouvez-la dans "Mes réservations" pour la payer.</p>
            <button className="btn btn-primary" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              <span><IconCalendar style={{ width: 13, height: 13, verticalAlign: -2 }} /> Date d'arrivée</span>
              <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
            </label>
            <label>
              <span><IconCalendar style={{ width: 13, height: 13, verticalAlign: -2 }} /> Date de départ</span>
              <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={envoi}>
              {envoi ? 'Envoi...' : 'Confirmer la réservation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
