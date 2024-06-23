package org.backend.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.backend.entity.Task;
import org.backend.entity.User;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TaskRepository implements PanacheRepository<Task> {

    public List<Task> getAllTasks() {
        return listAll();
    }

    public Optional<Task> findTaskById(Long id) {
        return findByIdOptional(id);
    }

    public Task createTask(Task task) {
        persist(task);
        return task;
    }

    public Task updateTask(Task task) {
        return getEntityManager().merge(task);
    }

    public void deleteTask(Long id) {
        findByIdOptional(id).ifPresent(this::delete);
    }

    public List<Task> getTasksByUser(User user) {
        return list("user", user);
    }
}
