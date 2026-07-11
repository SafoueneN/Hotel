package com.hotelbook.reservation.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PaiementEchoueListener {

    @RabbitListener(queues = RabbitMQConfig.QUEUE_PAIEMENT_ECHOUE)
    public void onPaiementEchoue(PaiementReussiMessage message) {
        log.warn("Evenement 'paiement.echoue' recu pour la reservation {} — la reservation reste EN_ATTENTE, le client peut retenter le paiement",
                message.getReservationId());
    }
}
