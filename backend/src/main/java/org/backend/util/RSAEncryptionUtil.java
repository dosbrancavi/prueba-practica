package org.backend.util;

import javax.crypto.Cipher;

import jakarta.enterprise.context.ApplicationScoped;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.logging.Logger;

@ApplicationScoped
public class RSAEncryptionUtil {
    private static final Logger LOGGER = Logger.getLogger(RSAEncryptionUtil.class.getName());
    private static final String ALGORITHM = "RSA";

    public KeyPair generateRSAKeys() {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance(ALGORITHM);
            keyGen.initialize(2048);
            return keyGen.generateKeyPair();
        } catch (Exception e) {
            LOGGER.severe("Error generating RSA keys: " + e.getMessage());
            return null;
        }
    }

    public String encryptPassword(String password, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedBytes = cipher.doFinal(password.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public String decryptPassword(String encryptedPassword, PrivateKey privateKey) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedPassword));
        return new String(decryptedBytes);
    }

    public String getPublicKeyBase64(PublicKey publicKey) {
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    public String getPrivateKeyBase64(PrivateKey privateKey) {
        return Base64.getEncoder().encodeToString(privateKey.getEncoded());
    }

    public KeyPair getKeyPairFromBase64(String publicKeyBase64, String privateKeyBase64) {
        try {
            byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyBase64);
            byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyBase64);

            KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);
            PublicKey publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(publicKeyBytes));
            PrivateKey privateKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(privateKeyBytes));

            return new KeyPair(publicKey, privateKey);
        } catch (Exception e) {
            LOGGER.severe("Error setting RSA keys: " + e.getMessage());
            return null;
        }
    }
}
