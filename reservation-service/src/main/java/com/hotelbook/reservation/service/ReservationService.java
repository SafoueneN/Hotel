package com.hotelbook.reservation.service;

import com.hotelbook.reservation.dto.ReservationRequest;
import com.hotelbook.reservation.exception.ChambreIndisponibleException;
import com.hotelbook.reservation.exception.ResourceNotFoundException;
import com.hotelbook.reservation.messaging.ReservationEventPublisher;
import com.hotelbook.reservation.model.Chambre;
import com.hotelbook.reservation.model.Reservation;
import com.hotelbook.reservation.model.StatutReservation;
import com.hotelbook.reservation.repository.ChambreRepository;
import com.hotelbook.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ChambreRepository chambreRepository;
    private final ReservationEventPublisher reservationEventPublisher;

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation introuvable avec id " + id));
    }

    public List<Reservation> findByClientEmail(String email) {
        return reservationRepository.findByClientEmail(email);
    }

    @Transactional
    public Reservation creer(ReservationRequest request) {
        Chambre chambre = chambreRepository.findById(request.getChambreId())
                .orElseThrow(() -> new ResourceNotFoundException("Chambre introuvable avec id " + request.getChambreId()));

        if (!request.getDateFin().isAfter(request.getDateDebut())) {
            throw new ChambreIndisponibleException("La date de fin doit être après la date de début");
        }

        if (!chambre.isDisponible()) {
            throw new ChambreIndisponibleException("La chambre " + chambre.getNumero() + " n'est pas disponible");
        }

        List<Reservation> conflits = reservationRepository.findConflits(
                chambre.getId(), request.getDateDebut(), request.getDateFin());
        if (!conflits.isEmpty()) {
            throw new ChambreIndisponibleException(
                    "La chambre " + chambre.getNumero() + " est déjà réservée sur cette période");
        }

        long nuits = ChronoUnit.DAYS.between(request.getDateDebut(), request.getDateFin());
        BigDecimal montantTotal = chambre.getPrixParNuit().multiply(BigDecimal.valueOf(nuits));

        Reservation reservation = new Reservation();
        reservation.setChambre(chambre);
        reservation.setClientNom(request.getClientNom());
        reservation.setClientEmail(request.getClientEmail());
        reservation.setDateDebut(request.getDateDebut());
        reservation.setDateFin(request.getDateFin());
        reservation.setMontantTotal(montantTotal);
        reservation.setStatut(StatutReservation.EN_ATTENTE);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation mettreAJour(Long id, ReservationRequest request) {
        Reservation reservation = findById(id);

        Chambre chambre = chambreRepository.findById(request.getChambreId())
                .orElseThrow(() -> new ResourceNotFoundException("Chambre introuvable avec id " + request.getChambreId()));

        if (!request.getDateFin().isAfter(request.getDateDebut())) {
            throw new ChambreIndisponibleException("La date de fin doit être après la date de début");
        }

        List<Reservation> conflits = reservationRepository.findConflitsPourModification(
                chambre.getId(), request.getDateDebut(), request.getDateFin(), id);
        if (!conflits.isEmpty()) {
            throw new ChambreIndisponibleException(
                    "La chambre " + chambre.getNumero() + " est déjà réservée sur cette période");
        }

        long nuits = ChronoUnit.DAYS.between(request.getDateDebut(), request.getDateFin());
        BigDecimal montantTotal = chambre.getPrixParNuit().multiply(BigDecimal.valueOf(nuits));

        reservation.setChambre(chambre);
        reservation.setClientNom(request.getClientNom());
        reservation.setClientEmail(request.getClientEmail());
        reservation.setDateDebut(request.getDateDebut());
        reservation.setDateFin(request.getDateFin());
        reservation.setMontantTotal(montantTotal);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation changerStatut(Long id, StatutReservation statut) {
        Reservation reservation = findById(id);
        reservation.setStatut(statut);
        Reservation sauvegardee = reservationRepository.save(reservation);
        if (statut == StatutReservation.ANNULEE) {
            reservationEventPublisher.publierReservationAnnulee(id);
        }
        return sauvegardee;
    }

    @Transactional
    public void supprimer(Long id) {
        Reservation reservation = findById(id);
        reservationRepository.delete(reservation);
        reservationEventPublisher.publierReservationAnnulee(id);
    }
}
