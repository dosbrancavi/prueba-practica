package org.backend.dao;

import org.backend.entity.User;
import java.util.Optional;

public interface UserDao {
    Optional<User> findByUsername(String username);
}
