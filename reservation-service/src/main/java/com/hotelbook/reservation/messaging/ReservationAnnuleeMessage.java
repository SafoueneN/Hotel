package com.hotelbook.reservation.messaging;

public class ReservationAnnuleeMessage {

    private Long reservationId;

    public ReservationAnnuleeMessage() {
    }

    public ReservationAnnuleeMessage(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }
}
