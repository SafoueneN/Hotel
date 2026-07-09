import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../useAuth';
import BookingModal from '../components/BookingModal';
import EmptyState from '../components/EmptyState';
import SkeletonGrid from '../components/SkeletonGrid';
import { IconSearch, IconMapPin, IconUsers, IconInbox, IconCalendar, IconCreditCard, IconBed } from '../components/icons';
import { IllustrationHero, IllustrationEmpty } from '../components/illustrations';
import { coverGradientFor } from '../utils/cover';
import { roomTypeColor } from '../utils/roomType';

export default function HotelsPage() {
  const { authenticated, login } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [ville, setVille] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [chambreAReserver, setChambreAReserver] = useState(null);

  useEffect(() => {
    apiClient
      .get('/api/hotels')
      .then((res) => setHotels(res.data))
      .catch(() => setError('Impossible de charger les hôtels'))
      .finally(() => setLoading(false));
  }, []);

  async function rechercherDisponibilites(e) {
    e.preventDefault();
    setError('');
    if (!ville || !dateDebut || !dateFin) {
      setError('Veuillez renseigner la ville et les dates');
      return;
    }
    setSearching(true);
    try {
      const res = await apiClient.get('/api/chambres/disponibles/recherche', {
        params: { ville, dateDebut, dateFin },
      });
      setSearchResults(res.data);
    } catch {
      setError('Erreur lors de la recherche de disponibilités');
    } finally {
      setSearching(false);
    }
  }

  function reinitialiserRecherche() {
    setSearchResults(null);
    setVille('');
    setDateDebut('');
    setDateFin('');
  }

  function onReserverClick(chambre, hotel) {
    if (!authenticated) {
      login();
      return;
    }
    setChambreAReserver({ chambre, hotel, dateDebut, dateFin });
  }

  const nombreHotels = hotels.length;

  return (
    <div>
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>Trouvez votre prochain séjour</h1>
            <p className="lead">Comparez les chambres disponibles dans nos hôtels partenaires et réservez en quelques secondes.</p>

            <form className="search-form" onSubmit={rechercherDisponibilites}>
              <div className="field">
                <IconMapPin />
                <input
                  type="text"
                  placeholder="Ville (ex: Marrakech)"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                />
              </div>
              <div className="field">
                <IconCalendar />
                <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
              </div>
              <div className="field">
                <IconCalendar />
                <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={searching}>
                <IconSearch /> {searching ? 'Recherche...' : 'Rechercher'}
              </button>
              {searchResults && (
                <button type="button" className="btn btn-ghost" onClick={reinitialiserRecherche}>
                  Réinitialiser
                </button>
              )}
            </form>

            <div className="trust-bar">
              <span><IconBed /> {nombreHotels || ''} hôtels partenaires</span>
              <span><IconCreditCard /> Paiement sécurisé</span>
              <span><IconUsers /> Confirmation automatisée</span>
            </div>
          </div>

          <IllustrationHero className="hero-illustration" aria-hidden="true" />
        </div>
      </div>

      <div className="page">
        {error && <p className="error">{error}</p>}

        {loading && <SkeletonGrid count={4} />}

        {!loading && searchResults ? (
          <section>
            <div className="hotel-block-header">
              <h2>Chambres disponibles à {ville}</h2>
              <span className="muted">du {dateDebut} au {dateFin}</span>
            </div>
            {searchResults.length === 0 ? (
              <EmptyState icon={<IllustrationEmpty style={{ width: 120, height: 96, color: 'var(--text-muted)' }} />} title="Aucune chambre disponible">
                Essayez d'autres dates ou une autre ville.
              </EmptyState>
            ) : (
              <div className="card-grid">
                {searchResults.map((chambre) => (
                  <div className="card" key={chambre.id}>
                    <div className="card-cover" style={{ background: coverGradientFor(chambre.hotel.id) }}>
                      {chambre.hotel.nom}
                    </div>
                    <div className="card-room-accent" style={{ '--room-color': roomTypeColor(chambre.type) }} />
                    <div className="card-body">
                      <h3>Chambre {chambre.numero}</h3>
                      <div className="card-meta">
                        <span><IconUsers /> {chambre.capacite} pers.</span>
                        <span className="room-type-chip" style={{ '--room-color': roomTypeColor(chambre.type) }}>{chambre.type}</span>
                      </div>
                      <div className="card-footer">
                        <span className="card-price">{chambre.prixParNuit} DH <small>/ nuit</small></span>
                        <button className="btn btn-primary btn-sm" onClick={() => onReserverClick(chambre, chambre.hotel)}>
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          !loading && (
            <section>
              {hotels.map((hotel) => (
                <div key={hotel.id} className="hotel-block">
                  <div className="hotel-cover" style={{ background: coverGradientFor(hotel.id) }}>
                    <h2>{hotel.nom}</h2>
                    <div className="hotel-cover-meta"><IconMapPin /> {hotel.ville}</div>
                    <p>{hotel.description}</p>
                  </div>
                  <div className="card-grid">
                    {hotel.chambres?.map((chambre) => (
                      <div className="card" key={chambre.id}>
                        <div className="card-room-accent" style={{ '--room-color': roomTypeColor(chambre.type) }} />
                        <div className="card-body">
                          <h3>Chambre {chambre.numero}</h3>
                          <div className="card-meta">
                            <span><IconUsers /> {chambre.capacite} pers.</span>
                            <span className="room-type-chip" style={{ '--room-color': roomTypeColor(chambre.type) }}>{chambre.type}</span>
                          </div>
                          <span className={chambre.disponible ? 'tag tag-ok' : 'tag tag-ko'}>
                            {chambre.disponible ? 'Disponible' : 'Indisponible'}
                          </span>
                          <div className="card-footer">
                            <span className="card-price">{chambre.prixParNuit} DH <small>/ nuit</small></span>
                            {chambre.disponible && (
                              <button className="btn btn-primary btn-sm" onClick={() => onReserverClick(chambre, hotel)}>
                                Réserver
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )
        )}
      </div>

      {chambreAReserver && (
        <BookingModal
          chambre={chambreAReserver.chambre}
          hotel={chambreAReserver.hotel}
          dateDebutInitiale={chambreAReserver.dateDebut}
          dateFinInitiale={chambreAReserver.dateFin}
          onClose={() => setChambreAReserver(null)}
        />
      )}
    </div>
  );
}
