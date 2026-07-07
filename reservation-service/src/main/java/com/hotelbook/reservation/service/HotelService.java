package com.hotelbook.reservation.service;

import com.hotelbook.reservation.exception.ResourceNotFoundException;
import com.hotelbook.reservation.model.Hotel;
import com.hotelbook.reservation.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    public List<Hotel> findAll() {
        return hotelRepository.findAll();
    }

    public Hotel findById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hôtel introuvable avec id " + id));
    }

    public Hotel create(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Hotel update(Long id, Hotel updated) {
        Hotel hotel = findById(id);
        hotel.setNom(updated.getNom());
        hotel.setVille(updated.getVille());
        hotel.setAdresse(updated.getAdresse());
        hotel.setDescription(updated.getDescription());
        return hotelRepository.save(hotel);
    }

    public void delete(Long id) {
        Hotel hotel = findById(id);
        hotelRepository.delete(hotel);
    }
}
