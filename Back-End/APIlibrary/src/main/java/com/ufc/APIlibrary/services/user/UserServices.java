package com.ufc.APIlibrary.services.user;


import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.user.LoginUserDTO;
import com.ufc.APIlibrary.dto.user.RegisterUserDTO;

public interface UserServices {

    String login(LoginUserDTO data);
    User register(RegisterUserDTO data);

}
