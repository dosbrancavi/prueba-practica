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
import java.util.List;

@Path("/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {

    @Inject
    private TaskService taskService;

    @Inject
    private CsrfTokenUtil csrfTokenUtil;

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

            if (taskDto.getImageFile() != null) {
                imageUrl = taskService.saveImage(taskDto.getImageFile());
            }

            Task task = new Task(taskDto.getDescription(), taskDto.getStatus(), imageUrl);

            User user = new User();
            user.setId(Long.valueOf(taskDto.getUserId()));

            task.setUser(user);

            Task createdTask = taskService.createTask(task);

            return Response.status(Response.Status.CREATED).entity(createdTask).build();

        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al guardar la imagen: " + e.getMessage())
                    .build();
        }
    }
    @PUT
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response updateTask(@Valid @MultipartForm TasksDTO taskDto,
            @HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);
    
        try {
            String imageUrl = null;
    
            Long taskId = Long.valueOf(taskDto.getId());
            Task existingTask = taskService.findTaskById(taskId);
    
            if (existingTask == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Task with id " + taskId + " not found")
                        .build();
            }
    
            if (taskDto.getImageFile() != null) {
                imageUrl = taskService.saveImage(taskDto.getImageFile());
            } else {
                imageUrl = existingTask.getImageUrl();
            }
    
            Long userId = taskDto.getUserId() != null ? Long.valueOf(taskDto.getUserId()) : null;
    
            boolean success = taskService.updateTask(
                    taskId,
                    taskDto.getDescription(),
                    taskDto.getStatus(),
                    imageUrl,
                    userId);
    
            if (success) {
                return Response.ok(true).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Task with id " + taskId + " not found")
                        .build();
            }
    
        } catch (NumberFormatException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid id format: " + taskDto.getId() + " or userId format: " + taskDto.getUserId())
                    .build();
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al guardar la imagen: " + e.getMessage())
                    .build();
        } catch (BadRequestException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage())
                    .build();
        }
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
