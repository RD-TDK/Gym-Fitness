package com.myfitnessapp.service.user.dto;

import com.myfitnessapp.service.user.domain.Gender;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserUpdateDTO {
    /** 新的姓名 */
    private String name;

    /** 新的性别 "MALE" / "FEMALE" */
    private Gender gender;

    /** 新的手机号 */
    private String phoneNumber;

    /** 新的地址 */
    private String address;

    /** 新的生日 */
    private LocalDate birthday;
}
