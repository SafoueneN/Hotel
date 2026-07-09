import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HotelsPage from './pages/HotelsPage';
import ReservationsPage from './pages/ReservationsPage';
import AdminStatsPage from './pages/AdminStatsPage';
import { useAuth } from './useAuth';

export default function App() {
  const { isAdmin } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HotelsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          {isAdmin && <Route path="/admin" element={<AdminStatsPage />} />}
        </Routes>
      </main>
      <footer className="app-footer">
        HotelBook — mini-projet microservices (Spring Boot · Node.js · Eureka · Gateway · Keycloak · RabbitMQ)
      </footer>
    </div>
  );
}
