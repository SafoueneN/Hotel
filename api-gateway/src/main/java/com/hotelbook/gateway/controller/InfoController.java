package com.hotelbook.gateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class InfoController {

    @Value("${app.hotelbook.nom-plateforme:HotelBook}")
    private String nomPlateforme;

    @GetMapping("/gateway/info")
    public Map<String, Object> info() {
        return Map.of(
                "service", "api-gateway",
                "nomPlateforme", nomPlateforme
        );
    }
}
