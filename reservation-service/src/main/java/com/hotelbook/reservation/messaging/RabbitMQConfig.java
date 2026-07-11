package com.hotelbook.reservation.messaging;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "hotelbook.exchange";
    public static final String ROUTING_KEY_PAIEMENT_REUSSI = "paiement.reussi";
    public static final String QUEUE_PAIEMENT_REUSSI = "reservation.paiement.queue";
    public static final String ROUTING_KEY_PAIEMENT_ECHOUE = "paiement.echoue";
    public static final String QUEUE_PAIEMENT_ECHOUE = "reservation.paiement.echoue.queue";
    public static final String ROUTING_KEY_RESERVATION_ANNULEE = "reservation.annulee";

    @Bean
    public TopicExchange hotelbookExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue paiementReussiQueue() {
        return new Queue(QUEUE_PAIEMENT_REUSSI, true);
    }

    @Bean
    public Binding paiementReussiBinding(Queue paiementReussiQueue, TopicExchange hotelbookExchange) {
        return BindingBuilder.bind(paiementReussiQueue).to(hotelbookExchange).with(ROUTING_KEY_PAIEMENT_REUSSI);
    }

    @Bean
    public Queue paiementEchoueQueue() {
        return new Queue(QUEUE_PAIEMENT_ECHOUE, true);
    }

    @Bean
    public Binding paiementEchoueBinding(Queue paiementEchoueQueue, TopicExchange hotelbookExchange) {
        return BindingBuilder.bind(paiementEchoueQueue).to(hotelbookExchange).with(ROUTING_KEY_PAIEMENT_ECHOUE);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
