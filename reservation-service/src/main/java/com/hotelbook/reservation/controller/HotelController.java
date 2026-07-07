package com.hotelbook.reservation.controller;

import com.hotelbook.reservation.model.Hotel;
import com.hotelbook.reservation.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public List<Hotel> findAll() {
        return hotelService.findAll();
    }

    @GetMapping("/{id}")
    public Hotel findById(@PathVariable Long id) {
        return hotelService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Hotel create(@Valid @RequestBody Hotel hotel) {
        return hotelService.create(hotel);
    }

    @PutMapping("/{id}")
    public Hotel update(@PathVariable Long id, @Valid @RequestBody Hotel hotel) {
        return hotelService.update(id, hotel);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        hotelService.delete(id);
    }
}
