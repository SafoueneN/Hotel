import { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/client';
import { IconChartBar, IconCreditCard, IconUsers } from '../components/icons';

function formatMontant(n) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n || 0) + ' DH';
}

const STATUT_META = {
  REUSSI: { label: 'Réussi', className: 'status-dot status-good', barClass: 'bar-fill-good' },
  ECHOUE: { label: 'Échoué', className: 'status-dot status-critical', barClass: 'bar-fill-critical' },
  EN_ATTENTE: { label: 'En attente', className: 'status-dot status-warning', barClass: 'bar-fill-warning' },
};

const METHODE_BAR_CLASSES = ['bar-fill-accent', 'bar-fill-accent-2', 'bar-fill-accent-3'];

function BarChart({ rows, maxLabelWidth = 110 }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="bar-chart">
      {rows.map((row) => (
        <div className="bar-row" key={row.key}>
          <span className="bar-label" style={{ minWidth: maxLabelWidth }}>
            {row.dot && <span className={row.dot} />}
            {row.label}
          </span>
          <div className="bar-track">
            <div
              className={`bar-fill ${row.barClass}`}
              style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }}
            />
          </div>
          <span className="bar-value">{row.valueLabel}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    setRefreshing(true);
    return apiClient
      .get('/api/paiements/stats')
      .then((res) => {
        setStats(res.data);
        setError('');
      })
      .catch(() => setError('Impossible de charger les statistiques'))
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!stats) {
    return (
      <div className="page">
        <h1>Tableau de bord</h1>
        <div className="kpi-row">
          <div className="skeleton" style={{ height: 90 }} />
          <div className="skeleton" style={{ height: 90 }} />
          <div className="skeleton" style={{ height: 90 }} />
        </div>
      </div>
    );
  }

  const { global, parStatut, parMethode } = stats;
  const reussi = parStatut.find((s) => s._id === 'REUSSI')?.nombre || 0;
  const total = parStatut.reduce((sum, s) => sum + s.nombre, 0);
  const tauxReussite = total ? Math.round((reussi / total) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Tableau de bord</h1>
          <p className="page-intro">Vue d'ensemble de l'activité de paiement de la plateforme.</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={load} disabled={refreshing}>
          {refreshing ? 'Actualisation…' : 'Actualiser'}
        </button>
      </div>

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
        <div className="stat-tile">
          <div className="stat-tile-icon"><IconChartBar /></div>
          <span className="stat-label">Taux de réussite</span>
          <span className="stat-value">{tauxReussite}%</span>
        </div>
      </div>

      <div className="stats-columns">
        <section>
          <h2>Répartition par statut</h2>
          <BarChart
            rows={parStatut.map((s) => {
              const meta = STATUT_META[s._id] || { label: s._id, className: 'status-dot', barClass: 'bar-fill-accent' };
              return {
                key: s._id,
                label: meta.label,
                dot: meta.className,
                value: s.nombre,
                valueLabel: `${s.nombre} · ${formatMontant(s.total)}`,
                barClass: meta.barClass,
              };
            })}
          />
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
          <BarChart
            rows={parMethode.map((m, i) => ({
              key: m._id,
              label: m._id,
              value: m.nombre,
              valueLabel: `${m.nombre} · ${formatMontant(m.total)}`,
              barClass: METHODE_BAR_CLASSES[i % METHODE_BAR_CLASSES.length],
            }))}
          />
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
