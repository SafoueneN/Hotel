package com.hotelbook.reservation.repository;

import com.hotelbook.reservation.model.Chambre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ChambreRepository extends JpaRepository<Chambre, Long> {
    List<Chambre> findByHotelId(Long hotelId);
    List<Chambre> findByDisponibleTrue();

    @Query("""
        SELECT c FROM Chambre c
        WHERE lower(c.hotel.ville) = lower(:ville)
        AND c.disponible = true
        AND c.id NOT IN (
            SELECT r.chambre.id FROM Reservation r
            WHERE r.statut <> com.hotelbook.reservation.model.StatutReservation.ANNULEE
            AND r.dateDebut < :dateFin
            AND r.dateFin > :dateDebut
        )
        """)
    List<Chambre> rechercherDisponibles(
            @Param("ville") String ville,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin
    );
}
