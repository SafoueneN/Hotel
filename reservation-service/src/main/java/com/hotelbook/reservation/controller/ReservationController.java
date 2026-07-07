package com.hotelbook.reservation.controller;

import com.hotelbook.reservation.dto.ReservationRequest;
import com.hotelbook.reservation.model.Reservation;
import com.hotelbook.reservation.model.StatutReservation;
import com.hotelbook.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

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

    @PatchMapping("/{id}/statut")
    public Reservation changerStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        StatutReservation statut = StatutReservation.valueOf(body.get("statut"));
        return reservationService.changerStatut(id, statut);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void annuler(@PathVariable Long id) {
        reservationService.annuler(id);
    }
}
