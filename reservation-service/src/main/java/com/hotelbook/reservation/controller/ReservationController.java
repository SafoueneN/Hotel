package com.hotelbook.reservation.controller;

import com.hotelbook.reservation.client.PaiementDto;
import com.hotelbook.reservation.client.PaymentServiceClient;
import com.hotelbook.reservation.dto.ReservationRecapDto;
import com.hotelbook.reservation.dto.ReservationRequest;
import com.hotelbook.reservation.model.Reservation;
import com.hotelbook.reservation.model.StatutReservation;
import com.hotelbook.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final PaymentServiceClient paymentServiceClient;

    @GetMapping
    public List<Reservation> findAll(@RequestParam(required = false) String email) {
        if (email != null) {
            return reservationService.findByClientEmail(email);
        }
        return reservationService.findAll();
    }

    @GetMapping("/{id}")
    public Reservation findById(@PathVariable Long id) {
        return reservationService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reservation creer(@Valid @RequestBody ReservationRequest request) {
        return reservationService.creer(request);
    }

    @PutMapping("/{id}")
    public Reservation mettreAJour(@PathVariable Long id, @Valid @RequestBody ReservationRequest request) {
        return reservationService.mettreAJour(id, request);
    }

    @PatchMapping("/{id}/statut")
    public Reservation changerStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        StatutReservation statut = StatutReservation.valueOf(body.get("statut"));
        return reservationService.changerStatut(id, statut);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Long id) {
        reservationService.supprimer(id);
    }

    // Communication synchrone via Feign (scenario 2) : proxy pur vers payment-service
    @GetMapping("/{id}/paiements")
    public List<PaiementDto> paiements(@PathVariable Long id) {
        return paymentServiceClient.getPaiementsParReservation(id);
    }

    // Communication synchrone via Feign (scenario 3) : agregation des donnees des deux services
    @GetMapping("/{id}/recap")
    public ReservationRecapDto recap(@PathVariable Long id) {
        Reservation reservation = reservationService.findById(id);
        List<PaiementDto> paiements = paymentServiceClient.getPaiementsParReservation(id);

        BigDecimal montantPaye = paiements.stream()
                .filter(p -> "REUSSI".equals(p.getStatut()))
                .map(PaiementDto::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ReservationRecapDto.builder()
                .reservationId(id)
                .statutReservation(reservation.getStatut())
                .montantTotal(reservation.getMontantTotal())
                .montantPaye(montantPaye)
                .resteAPayer(reservation.getMontantTotal().subtract(montantPaye))
                .nombrePaiements(paiements.size())
                .build();
    }
}
