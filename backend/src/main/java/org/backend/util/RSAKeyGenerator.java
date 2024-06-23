package org.backend.util;

import java.security.*;

public class RSAKeyGenerator {

    public static void main(String[] args) throws Exception {

        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048); 
        KeyPair keyPair = keyGen.generateKeyPair();

        PublicKey publicKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();

        System.out.println("Clave pública: " + publicKey);
        System.out.println("Clave privada: " + privateKey);
    }
}
