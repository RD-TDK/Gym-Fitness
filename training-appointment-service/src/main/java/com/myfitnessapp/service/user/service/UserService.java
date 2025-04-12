package com.myfitnessapp.service.user.service;

import com.myfitnessapp.service.user.dto.*;

public interface UserService {

    UserResponseDTO registerUser(UserRegistrationDTO registrationDTO);

    UserResponseDTO loginUser(UserLoginDTO loginDTO);

    UserResponseDTO updateUser(Integer id, UserUpdateDTO updateDTO);

    UserResponseDTO updateUserPassword(Integer id, UserPasswordUpdateDTO userPasswordUpdateDTO);

    UserResponseDTO updateUserEmail(Integer id, UserEmailUpdateDTO userEmailUpdateDTO);
    
    void cancelAccount(Integer id);
}
