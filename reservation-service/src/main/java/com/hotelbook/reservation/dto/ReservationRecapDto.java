package com.hotelbook.reservation.dto;

import com.hotelbook.reservation.model.StatutReservation;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ReservationRecapDto {
    private Long reservationId;
    private StatutReservation statutReservation;
    private BigDecimal montantTotal;
    private BigDecimal montantPaye;
    private BigDecimal resteAPayer;
    private int nombrePaiements;
}
