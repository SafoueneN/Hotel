package com.hotelbook.reservation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationRequest {

    @NotNull
    private Long chambreId;

    @NotNull
    private String clientNom;

    @NotNull
    @Email
    private String clientEmail;

    @NotNull
    @Future
    private LocalDate dateDebut;

    @NotNull
    @Future
    private LocalDate dateFin;
}
