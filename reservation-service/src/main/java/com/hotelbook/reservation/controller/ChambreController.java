package com.hotelbook.reservation.controller;

import com.hotelbook.reservation.model.Chambre;
import com.hotelbook.reservation.service.ChambreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chambres")
@RequiredArgsConstructor
public class ChambreController {

    private final ChambreService chambreService;

    @GetMapping
    public List<Chambre> findAll(@RequestParam(required = false) Long hotelId,
                                  @RequestParam(required = false) Boolean disponible) {
        if (hotelId != null) {
            return chambreService.findByHotel(hotelId);
        }
        if (Boolean.TRUE.equals(disponible)) {
            return chambreService.findDisponibles();
        }
        return chambreService.findAll();
    }

    @GetMapping("/{id}")
    public Chambre findById(@PathVariable Long id) {
        return chambreService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Chambre create(@Valid @RequestBody Chambre chambre) {
        return chambreService.create(chambre);
    }

    @PutMapping("/{id}")
    public Chambre update(@PathVariable Long id, @Valid @RequestBody Chambre chambre) {
        return chambreService.update(id, chambre);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        chambreService.delete(id);
    }
}
