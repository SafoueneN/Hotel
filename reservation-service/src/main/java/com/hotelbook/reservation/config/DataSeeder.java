package com.hotelbook.reservation.config;

import com.hotelbook.reservation.model.Chambre;
import com.hotelbook.reservation.model.Hotel;
import com.hotelbook.reservation.model.TypeChambre;
import com.hotelbook.reservation.repository.ChambreRepository;
import com.hotelbook.reservation.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final HotelRepository hotelRepository;
    private final ChambreRepository chambreRepository;

    @Override
    public void run(String... args) {
        if (hotelRepository.count() > 0) {
            return;
        }

        Hotel hotel1 = hotelRepository.save(new Hotel(null, "Hôtel Atlas", "Marrakech", "12 Avenue Mohammed VI", "Hôtel 4 étoiles au cœur de la médina", null));
        Hotel hotel2 = hotelRepository.save(new Hotel(null, "Hôtel Ocean", "Casablanca", "5 Boulevard de la Corniche", "Vue mer, proche de la plage", null));

        chambreRepository.save(new Chambre(null, "101", TypeChambre.SIMPLE, new BigDecimal("450.00"), 1, true, hotel1));
        chambreRepository.save(new Chambre(null, "102", TypeChambre.DOUBLE, new BigDecimal("650.00"), 2, true, hotel1));
        chambreRepository.save(new Chambre(null, "201", TypeChambre.SUITE, new BigDecimal("1200.00"), 4, true, hotel1));

        chambreRepository.save(new Chambre(null, "301", TypeChambre.DOUBLE, new BigDecimal("700.00"), 2, true, hotel2));
        chambreRepository.save(new Chambre(null, "302", TypeChambre.FAMILIALE, new BigDecimal("950.00"), 5, true, hotel2));
    }
}
