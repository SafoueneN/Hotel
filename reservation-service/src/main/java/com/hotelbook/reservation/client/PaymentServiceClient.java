package com.hotelbook.reservation.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Communication synchrone via Feign : reservation-service (Spring) appelle
 * payment-service (Node.js) a travers Eureka + le load-balancer client,
 * sans passer par l'API Gateway (appel service-a-service interne).
 */
@FeignClient(name = "payment-service")
public interface PaymentServiceClient {

    @GetMapping("/api/paiements/reservation/{reservationId}")
    List<PaiementDto> getPaiementsParReservation(@PathVariable("reservationId") Long reservationId);
}
