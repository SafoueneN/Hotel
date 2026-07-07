package com.hotelbook.reservation.service;

import com.hotelbook.reservation.exception.ResourceNotFoundException;
import com.hotelbook.reservation.model.Chambre;
import com.hotelbook.reservation.repository.ChambreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChambreService {

    private final ChambreRepository chambreRepository;

    public List<Chambre> findAll() {
        return chambreRepository.findAll();
    }

    public List<Chambre> findByHotel(Long hotelId) {
        return chambreRepository.findByHotelId(hotelId);
    }

    public List<Chambre> findDisponibles() {
        return chambreRepository.findByDisponibleTrue();
    }

    public Chambre findById(Long id) {
        return chambreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chambre introuvable avec id " + id));
    }

    public Chambre create(Chambre chambre) {
        return chambreRepository.save(chambre);
    }

    public Chambre update(Long id, Chambre updated) {
        Chambre chambre = findById(id);
        chambre.setNumero(updated.getNumero());
        chambre.setType(updated.getType());
        chambre.setPrixParNuit(updated.getPrixParNuit());
        chambre.setCapacite(updated.getCapacite());
        chambre.setDisponible(updated.isDisponible());
        return chambreRepository.save(chambre);
    }

    public void delete(Long id) {
        Chambre chambre = findById(id);
        chambreRepository.delete(chambre);
    }
}
