package com.hotelbook.reservation.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaiementDto {
    private Long reservationId;
    private String clientEmail;
    private BigDecimal montant;
    private String methode;
    private String statut;
}
