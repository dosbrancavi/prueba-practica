package org.backend.dao;

import org.backend.entity.Task;
import org.backend.entity.User;

import java.util.List;
import java.util.Optional;

public interface TaskDao {
    List<Task> getAllTasks();

    Optional<Task> findTaskById(Long id);

    Task createTask(Task task);

    Task updateTask(Task task);

    void deleteTask(Long id);

    List<Task> getTasksByUser(User user); // Método nuevo
}
