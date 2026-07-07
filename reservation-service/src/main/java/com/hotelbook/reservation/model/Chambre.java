package com.hotelbook.reservation.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "chambres")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chambre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numero;

    @Enumerated(EnumType.STRING)
    private TypeChambre type;

    @Column(nullable = false)
    private BigDecimal prixParNuit;

    private int capacite;

    private boolean disponible = true;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    @JsonIgnoreProperties("chambres")
    private Hotel hotel;
}
