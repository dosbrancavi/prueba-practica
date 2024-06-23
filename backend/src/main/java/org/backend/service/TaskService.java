package org.backend.service;

import org.backend.dao.TaskDao;
import org.backend.entity.Task;
import org.backend.entity.User;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TaskService {

    @Inject
    private TaskDao taskDao;

    public List<Task> getAllTasks() {
        return taskDao.getAllTasks();
    }

    public Task findTaskById(Long id) {
        Optional<Task> optionalTask = taskDao.findTaskById(id);
        return optionalTask.orElse(null);
    }

    @Transactional
    public Task createTask(Task task) {
        return taskDao.createTask(task);
    }

    public Task updateTask(Long id, Task task) {
        // Ensure the task being updated has the correct ID
        task.setId(id);
        return taskDao.updateTask(task);
    }

    public void deleteTask(Long id) {
        taskDao.deleteTask(id);
    }

    public List<Task> getTasksByUser(User user) {
        // Implement logic to fetch tasks associated with a specific user
        return taskDao.getTasksByUser(user);
    }
}
