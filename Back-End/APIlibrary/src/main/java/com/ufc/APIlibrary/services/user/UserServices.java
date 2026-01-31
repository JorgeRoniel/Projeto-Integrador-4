package com.ufc.APIlibrary.services.user;
import java.util.List;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.domain.User.UserRoles;
import com.ufc.APIlibrary.dto.user.LoginUserDTO;
import com.ufc.APIlibrary.dto.user.RegisterUserDTO;
import com.ufc.APIlibrary.dto.user.ResetPasswordDTO;
import com.ufc.APIlibrary.dto.user.ReturnLoginDTO;
import com.ufc.APIlibrary.dto.user.UpdateUserDTO;

public interface UserServices {

    ReturnLoginDTO login(LoginUserDTO data);
    User register(RegisterUserDTO data);
    void updateUser(Integer user_id, UpdateUserDTO data);
    void deleteUser(Integer user_id);
    void updateUserRole(String username, UserRoles role);
    List<String> listAdminUsernames();
    void recoverPassword(String email);
    void resetPassword(ResetPasswordDTO data);
}
