package org.backend.controller;

import org.backend.dto.TasksDTO;
import org.backend.entity.Task;
import org.backend.entity.User;
import org.backend.exeption.UnauthorizedException;
import org.backend.service.TaskService;
import org.backend.util.CsrfTokenUtil;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Path("/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {

    @Inject
    private TaskService taskService;

    @Inject
    private CsrfTokenUtil csrfTokenUtil;

    private static final String TASKS_IMAGES_DIR = "tasksImages";

    @GET
    public List<Task> getAllTasks(@HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);
        return taskService.getAllTasks();
    }

    @GET
    @Path("/{id}")
    public Response getTaskById(@PathParam("id") Long id) {
        Task task = taskService.findTaskById(id);
        if (task != null) {
            return Response.ok(task).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Task with id " + id + " not found").build();
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response createTask(
            @Valid @MultipartForm TasksDTO taskDto,
            @HeaderParam("X-CSRF-Token") String csrfToken) {
    
        validateCsrfToken(csrfToken);
    
        try {
            String imageUrl = null;
            
            // Si se proporcionó un archivo de imagen, guardarla y obtener la URL
            if (taskDto.getImageFile() != null) {
                imageUrl = taskService.saveImage(taskDto.getImageFile());
            }
    
            // Crear la tarea con o sin URL de imagen
            Task task = new Task(taskDto.getDescription(), taskDto.getStatus(), imageUrl);
            Task createdTask = taskService.createTask(task);
    
            return Response.status(Response.Status.CREATED).entity(createdTask).build();
    
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("Error al guardar la imagen: " + e.getMessage())
                           .build();
        }
    }

    @PUT
    public Response updateTask(@Valid Task task,
                               @HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);
        
        Long id = task.getId();
        
        Task updatedTask = taskService.updateTask(id, task);
        return Response.ok(updatedTask).build();
    }
    

    @DELETE
    @Path("/{id}")
    public Response deleteTask(@PathParam("id") Long id, @HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);
        taskService.deleteTask(id);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Path("/user/{userId}")
    public List<Task> getTasksByUser(@PathParam("userId") Long userId) {
        User user = new User();
        return taskService.getTasksByUser(user);
    }

    private void validateCsrfToken(String csrfToken) {
        if (!csrfTokenUtil.isValidCsrfToken(csrfToken)) {
            throw new UnauthorizedException("CSRF token is invalid");
        }
    }
}
