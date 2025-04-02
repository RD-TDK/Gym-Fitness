package com.myfitnessapp.trainingappointment;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages = {"com.myfitnessapp"})
@MapperScan("com.myfitnessapp.service.appointment.mapper")
public class TrainingAppointmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrainingAppointmentApplication.class, args);
    }

}
