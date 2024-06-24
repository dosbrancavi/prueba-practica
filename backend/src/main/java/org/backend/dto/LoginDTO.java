package org.backend.dto;

import org.backend.entity.User;
import lombok.Data;

@Data
public class LoginDTO {
    private User user;
    private String csrfToken;

    public LoginDTO(User user, String csrfToken) {
        this.user = user;
        this.csrfToken = csrfToken;
    }

    public String getCsrfToken() {
        return csrfToken;
    }

    public void setCsrfToken(String csrfToken) {
        this.csrfToken = csrfToken;
    }
}
