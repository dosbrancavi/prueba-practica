package org.backend.service;

import java.util.List;
import java.util.Set;

import org.backend.dto.UserDTO;
import org.backend.entity.User;
import org.backend.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

@ApplicationScoped
public class UserService {

    private final UserRepository userRepository;
    private final Validator validator;

    @Inject
    public UserService(UserRepository userRepository, Validator validator) {
        this.userRepository = userRepository;
        this.validator = validator;
    }

    @Transactional
    public User createUser(User user) {
        userRepository.persist(user);
        return user;
    }

    @Transactional
    public User updateUser(Long id, UserDTO userDTO) {
        validateUserDTO(userDTO);

        User existingUser = userRepository.findById(id);
        if (existingUser == null) {
            throw new IllegalArgumentException("User with id " + id + " not found");
        }
        existingUser.setUsername(userDTO.getUsername());
        existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        existingUser.setAge(userDTO.getAge());
        existingUser.setGender(userDTO.getGender());
        existingUser.setPassword(userDTO.getPassword());

        userRepository.persist(existingUser);
        return existingUser;
    }

    @Transactional
    public void deleteUser(Long id) {
        User existingUser = userRepository.findById(id);
        if (existingUser == null) {
            throw new IllegalArgumentException("User with id " + id + " not found");
        }
        userRepository.delete(existingUser);
    }

    public User findUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.listAll();
    }

    public boolean isUsernameTaken(String username) {
        User existingUser = userRepository.find("username", username).firstResult();
        return existingUser != null;
    }

    public User findUserByUsername(String username) {
        return userRepository.find("username", username).firstResult();
    }

    private void validateUserDTO(UserDTO userDTO) {
        Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
        if (!violations.isEmpty()) {
            throw new RuntimeException("Validation error: " + violations.iterator().next().getMessage());
        }
    }
}
