package com.hotelbook.reservation.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class InfoController {

    @Value("${app.hotelbook.nom-plateforme:HotelBook}")
    private String nomPlateforme;

    @Value("${reservation.max-jours-avance:180}")
    private int maxJoursAvance;

    @Value("${reservation.min-jours-avant-arrivee:0}")
    private int minJoursAvantArrivee;

    @GetMapping("/api/info")
    public Map<String, Object> info() {
        return Map.of(
                "service", "reservation-service",
                "nomPlateforme", nomPlateforme,
                "maxJoursAvance", maxJoursAvance,
                "minJoursAvantArrivee", minJoursAvantArrivee
        );
    }
}
