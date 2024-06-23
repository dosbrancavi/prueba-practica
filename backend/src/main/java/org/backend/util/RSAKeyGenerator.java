package org.backend.util;

import java.security.*;

public class RSAKeyGenerator {

    public static void main(String[] args) throws Exception {
        // Genera un par de claves RSA
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048); // Tamaño de la clave, puedes ajustarlo según tus necesidades
        KeyPair keyPair = keyGen.generateKeyPair();

        // Imprime la clave pública y privada
        PublicKey publicKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();

        System.out.println("Clave pública: " + publicKey);
        System.out.println("Clave privada: " + privateKey);
    }
}
