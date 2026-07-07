package com.hotelbook.reservation.repository;

import com.hotelbook.reservation.model.Chambre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChambreRepository extends JpaRepository<Chambre, Long> {
    List<Chambre> findByHotelId(Long hotelId);
    List<Chambre> findByDisponibleTrue();
}
