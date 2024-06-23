package org.backend.util;

import jakarta.enterprise.context.ApplicationScoped;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class CsrfTokenUtil {

    private static final int CSRF_TOKEN_LENGTH = 32;
    private final Map<String, Long> csrfTokens = new HashMap<>();

    public String generateCsrfToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[CSRF_TOKEN_LENGTH];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        // Almacenar el token en la memoria o en una base de datos para validar
        csrfTokens.put(token, System.currentTimeMillis());

        return token;
    }

    public boolean isValidCsrfToken(String token) {
        // Validar que el token exista en el mapa y no haya expirado (opcional)
        return csrfTokens.containsKey(token);
    }
}
