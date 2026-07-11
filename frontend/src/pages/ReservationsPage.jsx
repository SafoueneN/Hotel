import { Fragment, useCallback, useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../useAuth';
import EmptyState from '../components/EmptyState';
import { IconCreditCard, IconTrash } from '../components/icons';
import { IllustrationEmpty } from '../components/illustrations';

const STATUT_LABELS = {
  EN_ATTENTE: { label: 'En attente de paiement', className: 'tag tag-warn' },
  CONFIRMEE: { label: 'Confirmée', className: 'tag tag-ok' },
  ANNULEE: { label: 'Annulée', className: 'tag tag-ko' },
};

const STATUT_PAIEMENT_LABELS = {
  REUSSI: { label: 'Réussi', className: 'tag tag-ok' },
  ECHOUE: { label: 'Échoué', className: 'tag tag-ko' },
  REMBOURSE: { label: 'Remboursé', className: 'tag tag-warn' },
};

function formatMontant(n) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n || 0) + ' DH';
}

// Details d'une reservation : illustre les 2 scenarios de communication
// synchrone via Feign Client (reservation-service -> payment-service) :
// GET /{id}/paiements (historique) et GET /{id}/recap (agregation).
function DetailsReservation({ reservationId }) {
  const [recap, setRecap] = useState(null);
  const [paiements, setPaiements] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get(`/api/reservations/${reservationId}/recap`),
      apiClient.get(`/api/reservations/${reservationId}/paiements`),
    ])
      .then(([recapRes, paiementsRes]) => {
        setRecap(recapRes.data);
        setPaiements(paiementsRes.data);
      })
      .catch(() => setError('Impossible de charger le détail des paiements'));
  }, [reservationId]);

  if (error) return <p className="error" style={{ margin: 0 }}>{error}</p>;
  if (!recap || !paiements) return <div className="skeleton" style={{ height: 60 }} />;

  return (
    <div className="details-paiement">
      <div className="kpi-row" style={{ marginBottom: 14 }}>
        <div className="stat-tile">
          <span className="stat-label">Montant payé</span>
          <span className="stat-value">{formatMontant(recap.montantPaye)}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Reste à payer</span>
          <span className="stat-value">{formatMontant(recap.resteAPayer)}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Nombre de paiements</span>
          <span className="stat-value">{recap.nombrePaiements}</span>
        </div>
      </div>

      {paiements.length === 0 ? (
        <p className="muted">Aucun paiement enregistré pour cette réservation.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Statut</th><th>Méthode</th><th>Montant</th></tr>
            </thead>
            <tbody>
              {paiements.map((p, i) => {
                const meta = STATUT_PAIEMENT_LABELS[p.statut] || { label: p.statut, className: 'tag' };
                return (
                  <tr key={i}>
                    <td><span className={meta.className}>{meta.label}</span></td>
                    <td>{p.methode}</td>
                    <td>{formatMontant(p.montant)}</td>
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

export default function ReservationsPage() {
  const { email, isAdmin } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [paiementEnCours, setPaiementEnCours] = useState(null);
  const [message, setMessage] = useState('');
  const [detailsOuverts, setDetailsOuverts] = useState(() => new Set());

  function toggleDetails(reservationId) {
    setDetailsOuverts((precedent) => {
      const suivant = new Set(precedent);
      if (suivant.has(reservationId)) {
        suivant.delete(reservationId);
      } else {
        suivant.add(reservationId);
      }
      return suivant;
    });
  }

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
        <EmptyState icon={<IllustrationEmpty style={{ width: 120, height: 96, color: 'var(--text-muted)' }} />} title="Aucune réservation pour le moment">
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
                const ouvert = detailsOuverts.has(r.id);
                return (
                  <Fragment key={r.id}>
                    <tr>
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
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleDetails(r.id)}>
                          {ouvert ? 'Masquer' : 'Détails'}
                        </button>
                        {isAdmin && (
                          <button className="btn btn-danger btn-sm" onClick={() => supprimer(r.id)}>
                            <IconTrash /> Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                    {ouvert && (
                      <tr>
                        <td colSpan={isAdmin ? 7 : 6} style={{ background: 'var(--page)' }}>
                          <DetailsReservation reservationId={r.id} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
