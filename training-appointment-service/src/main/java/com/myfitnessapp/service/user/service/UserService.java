package com.myfitnessapp.service.user.service;

import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.dto.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public interface UserService {

    UserResponseDTO registerUser(UserRegistrationDTO registrationDTO);

    UserResponseDTO loginUser(UserLoginDTO loginDTO);

    UserResponseDTO updateUser(Integer id, UserUpdateDTO updateDTO);

    UserResponseDTO updateUserPassword(Integer id, UserPasswordUpdateDTO userPasswordUpdateDTO);

    UserResponseDTO updateUserEmail(Integer id, UserEmailUpdateDTO userEmailUpdateDTO);
    
    void cancelAccount(Integer id);

    User loadDomainUserByEmail(@NotBlank(message = "The email cannot be empty") @Email(message = "The email format is incorrect") String email);


}
