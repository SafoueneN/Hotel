package com.hotelbook.reservation.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

/**
 * Publie des evenements consommes par payment-service : reservation-service
 * initie ici une communication asynchrone dans l'autre sens (Java -> Node),
 * symetrique de payment-service qui publie "paiement.reussi"/"paiement.echoue".
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publierReservationAnnulee(Long reservationId) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY_RESERVATION_ANNULEE,
                new ReservationAnnuleeMessage(reservationId));
        log.info("Evenement 'reservation.annulee' publie pour la reservation {}", reservationId);
    }
}
