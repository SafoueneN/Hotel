package com.hotelbook.reservation.messaging;

import com.hotelbook.reservation.model.StatutReservation;
import com.hotelbook.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaiementReussiListener {

    private final ReservationService reservationService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PAIEMENT_REUSSI)
    public void onPaiementReussi(PaiementReussiMessage message) {
        log.info("Evenement 'paiement.reussi' recu pour la reservation {}", message.getReservationId());
        reservationService.changerStatut(message.getReservationId(), StatutReservation.CONFIRMEE);
        log.info("Reservation {} confirmee automatiquement suite au paiement", message.getReservationId());
    }
}
