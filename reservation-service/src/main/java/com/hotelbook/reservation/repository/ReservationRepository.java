package com.hotelbook.reservation.repository;

import com.hotelbook.reservation.model.Reservation;
import com.hotelbook.reservation.model.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByClientEmail(String clientEmail);

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.chambre.id = :chambreId
        AND r.statut <> com.hotelbook.reservation.model.StatutReservation.ANNULEE
        AND r.dateDebut < :dateFin
        AND r.dateFin > :dateDebut
        """)
    List<Reservation> findConflits(
            @Param("chambreId") Long chambreId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin
    );

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.chambre.id = :chambreId
        AND r.id <> :excludeId
        AND r.statut <> com.hotelbook.reservation.model.StatutReservation.ANNULEE
        AND r.dateDebut < :dateFin
        AND r.dateFin > :dateDebut
        """)
    List<Reservation> findConflitsPourModification(
            @Param("chambreId") Long chambreId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin,
            @Param("excludeId") Long excludeId
    );

    List<Reservation> findByStatut(StatutReservation statut);
}
