import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../useAuth';
import BookingModal from '../components/BookingModal';

export default function HotelsPage() {
  const { authenticated, login } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [ville, setVille] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
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
    try {
      const res = await apiClient.get('/api/chambres/disponibles/recherche', {
        params: { ville, dateDebut, dateFin },
      });
      setSearchResults(res.data);
    } catch {
      setError('Erreur lors de la recherche de disponibilités');
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

  return (
    <div className="page">
      <h1>Nos hôtels</h1>

      <form className="search-form" onSubmit={rechercherDisponibilites}>
        <input
          type="text"
          placeholder="Ville (ex: Marrakech)"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        />
        <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
        <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
        <button type="submit" className="btn btn-primary">Rechercher des disponibilités</button>
        {searchResults && (
          <button type="button" className="btn btn-ghost" onClick={reinitialiserRecherche}>
            Réinitialiser
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Chargement...</p>}

      {searchResults ? (
        <section>
          <h2>Chambres disponibles à {ville} du {dateDebut} au {dateFin}</h2>
          {searchResults.length === 0 && <p>Aucune chambre disponible pour cette période.</p>}
          <div className="card-grid">
            {searchResults.map((chambre) => (
              <div className="card" key={chambre.id}>
                <h3>{chambre.hotel.nom} — Chambre {chambre.numero}</h3>
                <p>{chambre.type} · {chambre.capacite} pers. · {chambre.prixParNuit} DH/nuit</p>
                <button className="btn btn-primary" onClick={() => onReserverClick(chambre, chambre.hotel)}>
                  Réserver
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section>
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-block">
              <h2>{hotel.nom} — {hotel.ville}</h2>
              <p className="muted">{hotel.description}</p>
              <div className="card-grid">
                {hotel.chambres?.map((chambre) => (
                  <div className="card" key={chambre.id}>
                    <h3>Chambre {chambre.numero}</h3>
                    <p>{chambre.type} · {chambre.capacite} pers. · {chambre.prixParNuit} DH/nuit</p>
                    <p className={chambre.disponible ? 'tag tag-ok' : 'tag tag-ko'}>
                      {chambre.disponible ? 'Disponible' : 'Indisponible'}
                    </p>
                    {chambre.disponible && (
                      <button className="btn btn-primary" onClick={() => onReserverClick(chambre, hotel)}>
                        Réserver
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

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
