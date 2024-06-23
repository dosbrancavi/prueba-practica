package org.backend.dao.impl;

import org.backend.dao.TaskDao;
import org.backend.entity.Task;
import org.backend.entity.User;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TaskDaoImpl implements TaskDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Task> getAllTasks() {
        return entityManager.createQuery("SELECT t FROM Task t", Task.class)
                .getResultList();
    }

    @Override
    public Optional<Task> findTaskById(Long id) {
        return Optional.ofNullable(entityManager.find(Task.class, id));
    }

    @Override
    public Task createTask(Task task) {
        entityManager.persist(task);
        return task;
    }

    @Override
    public Task updateTask(Task task) {
        return entityManager.merge(task);
    }

    @Override
    public void deleteTask(Long id) {
        Task task = entityManager.find(Task.class, id);
        if (task != null) {
            entityManager.remove(task);
        }
    }

    @Override
    public List<Task> getTasksByUser(User user) {
        return entityManager.createQuery("SELECT t FROM Task t WHERE t.user = :user", Task.class)
                .setParameter("user", user)
                .getResultList();
    }
}
