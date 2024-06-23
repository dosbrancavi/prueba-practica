package org.backend.util;

import jakarta.enterprise.context.ApplicationScoped;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class CsrfTokenUtil {

    private static final int CSRF_TOKEN_LENGTH = 32;
    private static final long TOKEN_EXPIRATION_TIME_MS = 30 * 60 * 1000; // 30 minutos de expiración
    private final Map<String, Long> csrfTokens = new HashMap<>();

    public String generateCsrfToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[CSRF_TOKEN_LENGTH];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        // Almacenar el token con la marca de tiempo actual
        csrfTokens.put(token, System.currentTimeMillis());

        return token;
    }

    public boolean isValidCsrfToken(String token) {
        Long timestamp = csrfTokens.get(token);
        if (timestamp != null) {
            // Verificar si el token ha expirado
            if (System.currentTimeMillis() - timestamp <= TOKEN_EXPIRATION_TIME_MS) {
                return true;
            } else {
                // Si ha expirado, eliminarlo del mapa
                csrfTokens.remove(token);
                return false;
            }
        }
        return false; // El token no existe en el mapa
    }
}
