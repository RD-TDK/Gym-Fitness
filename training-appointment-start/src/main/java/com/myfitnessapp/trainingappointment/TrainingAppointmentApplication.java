package com.myfitnessapp.trainingappointment;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.myfitnessapp"})
//@MapperScan("com.myfitnessapp.service.appointment.mapper")
@MapperScan({
        "com.myfitnessapp.service.appointment.mapper",
        "com.myfitnessapp.service.user.mapper",
        "com.myfitnessapp.service.user.handler",
        "com.myfitnessapp.service.membership.mapper",
        "com.myfitnessapp.service.trainer.mapper"
})
@ComponentScan(basePackages = {
        "com.myfitnessapp.trainingappointment",
        "com.myfitnessapp.trainingappointment.demos.web.controller",
        "com.myfitnessapp.service.appointment.service",
        "com.myfitnessapp.service.user.*",
        "com.myfitnessapp.service.membership.*",
        "com.myfitnessapp.service.trainer.*",
})
@EnableScheduling
public class TrainingAppointmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrainingAppointmentApplication.class, args);
    }

}
