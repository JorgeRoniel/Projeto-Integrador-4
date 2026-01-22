package com.ufc.APIlibrary.services.user;


import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.user.LoginUserDTO;
import com.ufc.APIlibrary.dto.user.RegisterUserDTO;
import com.ufc.APIlibrary.dto.user.ReturnLoginDTO;
import com.ufc.APIlibrary.dto.user.UpdateUserDTO;

public interface UserServices {

    ReturnLoginDTO login(LoginUserDTO data);
    User register(RegisterUserDTO data);
    void updateUser(Integer user_id, UpdateUserDTO data);
    void deleteUser(Integer user_id);

}
