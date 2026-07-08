package com.hotelbook.reservation.messaging;

public class PaiementReussiMessage {

    private Long reservationId;

    public PaiementReussiMessage() {
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }
}
