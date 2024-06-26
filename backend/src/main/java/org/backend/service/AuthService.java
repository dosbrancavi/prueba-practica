package org.backend.service;

import org.backend.entity.User;
import org.backend.repository.UserRepository;
import org.backend.util.RSAEncryptionUtil;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.security.PrivateKey;
import java.util.Optional;

@ApplicationScoped
public class AuthService {

    @Inject
    private UserRepository userRepository;

    @Inject
    private RSAEncryptionUtil rsaEncryptionUtil;

    public User authenticate(String username, String password) throws Exception {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String storedPasswordEncrypted = user.getPassword();
            PrivateKey privateKey = rsaEncryptionUtil.getKeyPairFromBase64(user.getPublicKeyBase64(), user.getPrivateKeyBase64()).getPrivate();
            String decryptedPassword = rsaEncryptionUtil.decryptPassword(storedPasswordEncrypted, privateKey);
            if (decryptedPassword.equals(password)) {
                return user;
            }
        }
        return null;
    }
}
