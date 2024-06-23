package org.backend.dao.impl;

import org.backend.dao.UserDao;
import org.backend.entity.User;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.Optional;

@ApplicationScoped
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<User> findByUsername(String username) {
        try {
            User user = entityManager.createQuery(
                    "SELECT u FROM User u WHERE u.username = :username", User.class)
                    .setParameter("username", username)
                    .getSingleResult();
            return Optional.of(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
