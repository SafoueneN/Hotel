import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { IconChartBar, IconCreditCard, IconUsers } from '../components/icons';

function formatMontant(n) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n || 0) + ' DH';
}

const STATUT_META = {
  REUSSI: { label: 'Réussi', className: 'status-dot status-good' },
  ECHOUE: { label: 'Échoué', className: 'status-dot status-critical' },
  EN_ATTENTE: { label: 'En attente', className: 'status-dot status-warning' },
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/api/paiements/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Impossible de charger les statistiques'));
  }, []);

  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!stats) {
    return (
      <div className="page">
        <h1>Statistiques des paiements</h1>
        <div className="kpi-row">
          <div className="skeleton" style={{ height: 90 }} />
          <div className="skeleton" style={{ height: 90 }} />
          <div className="skeleton" style={{ height: 90 }} />
        </div>
      </div>
    );
  }

  const { global, parStatut, parMethode } = stats;

  return (
    <div className="page">
      <h1>Statistiques des paiements</h1>
      <p className="page-intro">Vue d'ensemble de l'activité de paiement de la plateforme.</p>

      <div className="kpi-row">
        <div className="stat-tile">
          <div className="stat-tile-icon"><IconChartBar /></div>
          <span className="stat-label">Total encaissé</span>
          <span className="stat-value">{formatMontant(global.totalEncaisse)}</span>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-icon"><IconCreditCard /></div>
          <span className="stat-label">Montant moyen par paiement</span>
          <span className="stat-value">{formatMontant(Math.round(global.montantMoyen))}</span>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-icon"><IconUsers /></div>
          <span className="stat-label">Paiements réussis</span>
          <span className="stat-value">{global.nombrePaiements}</span>
        </div>
      </div>

      <div className="stats-columns">
        <section>
          <h2>Répartition par statut</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Statut</th><th>Nombre</th><th>Montant</th></tr>
              </thead>
              <tbody>
                {parStatut.map((s) => {
                  const meta = STATUT_META[s._id] || { label: s._id, className: 'status-dot' };
                  return (
                    <tr key={s._id}>
                      <td><span className={meta.className} /> {meta.label}</td>
                      <td>{s.nombre}</td>
                      <td>{formatMontant(s.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Répartition par méthode (paiements réussis)</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Méthode</th><th>Nombre</th><th>Montant</th></tr>
              </thead>
              <tbody>
                {parMethode.map((m) => (
                  <tr key={m._id}>
                    <td>{m._id}</td>
                    <td>{m.nombre}</td>
                    <td>{formatMontant(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
