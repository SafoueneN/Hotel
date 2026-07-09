import { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../useAuth';
import EmptyState from '../components/EmptyState';
import { IconCreditCard, IconTrash, IconInbox } from '../components/icons';

const STATUT_LABELS = {
  EN_ATTENTE: { label: 'En attente de paiement', className: 'tag tag-warn' },
  CONFIRMEE: { label: 'Confirmée', className: 'tag tag-ok' },
  ANNULEE: { label: 'Annulée', className: 'tag tag-ko' },
};

export default function ReservationsPage() {
  const { email, isAdmin } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [paiementEnCours, setPaiementEnCours] = useState(null);
  const [message, setMessage] = useState('');

  const charger = useCallback(() => {
    setLoading(true);
    apiClient
      .get('/api/reservations', { params: isAdmin ? {} : { email } })
      .then((res) => setReservations(res.data))
      .catch(() => setError('Impossible de charger les réservations'))
      .finally(() => setLoading(false));
  }, [email, isAdmin]);

  useEffect(() => {
    charger();
  }, [charger]);

  async function payer(reservationId) {
    setPaiementEnCours(reservationId);
    setMessage('');
    setError('');
    try {
      const res = await apiClient.post(`/api/paiements/reservation/${reservationId}/payer`, { methode: 'CARTE' });
      if (res.data.statut === 'REUSSI') {
        setMessage('Paiement accepté ! La réservation sera confirmée dans un instant (traitement asynchrone).');
        setTimeout(charger, 1500);
      } else {
        setMessage('Le paiement a échoué. Vous pouvez réessayer.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setPaiementEnCours(null);
    }
  }

  async function supprimer(reservationId) {
    if (!window.confirm('Supprimer définitivement cette réservation ?')) return;
    try {
      await apiClient.delete(`/api/reservations/${reservationId}`);
      charger();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  }

  return (
    <div className="page">
      <h1>{isAdmin ? 'Toutes les réservations' : 'Mes réservations'}</h1>
      <p className="page-intro">
        {isAdmin ? 'Vue d\'ensemble de toutes les réservations clients.' : 'Suivez et payez vos réservations en cours.'}
      </p>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {loading && <div className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-md)' }} />}

      {!loading && reservations.length === 0 && (
        <EmptyState icon={<IconInbox />} title="Aucune réservation pour le moment">
          Réservez une chambre depuis la page Hôtels pour la voir apparaître ici.
        </EmptyState>
      )}

      {!loading && reservations.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {isAdmin && <th>Client</th>}
                <th>Chambre</th>
                <th>Hôtel</th>
                <th>Dates</th>
                <th>Montant</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => {
                const statut = STATUT_LABELS[r.statut] || { label: r.statut, className: 'tag' };
                return (
                  <tr key={r.id}>
                    {isAdmin && <td>{r.clientNom} <span className="muted">({r.clientEmail})</span></td>}
                    <td>{r.chambre?.numero}</td>
                    <td>{r.chambre?.hotel?.nom}</td>
                    <td>{r.dateDebut} → {r.dateFin}</td>
                    <td>{r.montantTotal} DH</td>
                    <td><span className={statut.className}>{statut.label}</span></td>
                    <td className="actions">
                      {r.statut === 'EN_ATTENTE' && (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={paiementEnCours === r.id}
                          onClick={() => payer(r.id)}
                        >
                          <IconCreditCard /> {paiementEnCours === r.id ? 'Traitement...' : 'Payer'}
                        </button>
                      )}
                      {isAdmin && (
                        <button className="btn btn-danger btn-sm" onClick={() => supprimer(r.id)}>
                          <IconTrash /> Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
