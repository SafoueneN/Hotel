package com.hotelbook.reservation.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI reservationServiceOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("HotelBook — reservation-service")
                        .description("Hôtels, chambres et réservations (Spring Boot + MySQL/H2)")
                        .version("v1"));
    }
}
