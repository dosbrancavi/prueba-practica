public class RSATest {

    public static void main(String[] args) {
        RSAEncryptionUtil encryptionUtil = new RSAEncryptionUtil();

        // Datos a encriptar y desencriptar
        String originalPassword = "secretPassword123";

        // Encriptar
        String encryptedPassword = encryptionUtil.encryptPassword(originalPassword);
        System.out.println("Encrypted password: " + encryptedPassword);

        // Desencriptar
        String decryptedPassword = encryptionUtil.decryptPassword(encryptedPassword);
        System.out.println("Decrypted password: " + decryptedPassword);
    }
}
