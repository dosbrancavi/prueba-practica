package org.backend.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.backend.entity.User;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {
    
}
