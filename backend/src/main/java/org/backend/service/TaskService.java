package org.backend.service;

import org.backend.entity.Task;
import org.backend.entity.User;
import org.backend.repository.TaskRepository;
import org.backend.repository.UserRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.*;

@ApplicationScoped
public class TaskService {

    @Inject
    private UserRepository userRepository;

    @Inject
    private TaskRepository taskRepository;

    private static final String TASKS_IMAGES_DIR = "tasksImages"; // Directorio para almacenar las imágenes

    public String saveImage(InputStream imageFile) throws IOException {
        // Verificar si el directorio tasksImages existe, si no, crearlo
        Path directory = Paths.get(TASKS_IMAGES_DIR);
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }

        // Generar un nombre único para la imagen
        String fileName = UUID.randomUUID().toString() + ".jpg";
        Path filePath = directory.resolve(fileName);

        // Guardar el archivo de imagen en el servidor local
        Files.copy(imageFile, filePath, StandardCopyOption.REPLACE_EXISTING);

        return "http://localhost:9090/tasksImages/" + fileName; // Este será el URL que se guarda en la base de datos
    }

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
    public boolean updateTask(Long id, String description, String status, String imageUrl, Long userId)
            throws IOException {
        Task existingTask = findTaskById(id);
        if (existingTask == null) {
            throw new BadRequestException("Task with id " + id + " not found");
        }
    
        // Guardar la URL de la imagen existente antes de actualizar
        String existingImageUrl = existingTask.getImageUrl();
    
        // Solo eliminar la imagen existente si se proporciona una nueva imagen
        if (imageUrl != null && existingImageUrl != null && !imageUrl.equals(existingImageUrl)) {
            deleteImage(existingImageUrl);
        }
    
        // Actualizar la URL de la imagen solo si se proporciona una nueva URL
        if (imageUrl != null) {
            existingTask.setImageUrl(imageUrl);
        }
    
        existingTask.setDescription(description);
        existingTask.setStatus(status);
    
        if (userId != null) {
            User user = new User();
            user.setId(userId);
            existingTask.setUser(user);
        }
    
        Task updatedTask = taskRepository.updateTask(existingTask);
    
        return updatedTask != null;
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

    public void deleteImage(String imageUrl) throws IOException {
        if (imageUrl != null) {
            Path filePath = Paths.get(TASKS_IMAGES_DIR, imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
            Files.deleteIfExists(filePath);
        }
    }

}
