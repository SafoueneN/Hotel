package com.hotelbook.reservation.exception;

public class ChambreIndisponibleException extends RuntimeException {
    public ChambreIndisponibleException(String message) {
        super(message);
    }
}
