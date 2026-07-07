package com.hotelbook.reservation.repository;

import com.hotelbook.reservation.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
