package org.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {

    @NotBlank(message = "Username is mandatory")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String username;

    @Pattern(regexp = "\\d{4}-\\d{4}", message = "Phone number must be in format 0000-0000")
    @Size(min = 9, max = 9, message = "Phone number must be exactly 9 characters including hyphen")
    private String phoneNumber;

    @Min(value = 1, message = "Age must be a positive number")
    private Integer age;

    @NotBlank(message = "Gender is mandatory")
    private String gender;

    @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,50}$", message = "Password must contain uppercase, lowercase letters and numbers")
    private String password;
}