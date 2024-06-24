package org.backend.service;

import org.backend.entity.Task;
import org.backend.entity.User;
import org.backend.repository.TaskRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TaskService {

    @Inject
    private TaskRepository taskRepository;

    @Inject
    private UserService userService;

    @Transactional
    public List<Task> getAllTasks() {
        return taskRepository.getAllTasks();
    }

    public Task findTaskById(Long id) {
        Optional<Task> optionalTask = taskRepository.findTaskById(id);
        return optionalTask.orElse(null);
    }

    @Transactional
    public Task createTask(Task task) {

        return taskRepository.createTask(task);
    }

    @Transactional
    public Task updateTask(Long id, Task task) {
        Task existingTask = findTaskById(id);
        if (existingTask == null) {
            throw new BadRequestException("Task with id " + id + " not found");
        }

        task.setId(id);
        return taskRepository.updateTask(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task existingTask = findTaskById(id);
        if (existingTask == null) {
            throw new BadRequestException("Task with id " + id + " not found");
        }

        taskRepository.deleteTask(id);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.getTasksByUser(user);
    }


}
