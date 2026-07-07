package com.hotelbook.reservation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chambre_id", nullable = false)
    private Chambre chambre;

    @Column(nullable = false)
    private String clientNom;

    @Column(nullable = false)
    private String clientEmail;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    @Column(nullable = false)
    private BigDecimal montantTotal;

    @Enumerated(EnumType.STRING)
    private StatutReservation statut = StatutReservation.EN_ATTENTE;

    private LocalDateTime dateCreation = LocalDateTime.now();
}
