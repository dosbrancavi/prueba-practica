package org.backend.controller;

import org.backend.entity.Task;
import org.backend.entity.User;
import org.backend.service.TaskService;
import org.backend.service.UserService;
import org.backend.util.CsrfTokenUtil;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.logging.Logger;

@Path("/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {

    @Inject
    private TaskService taskService;

    @Inject
    private UserService userService;

    @Inject
    private CsrfTokenUtil csrfTokenUtil;

    private static final Logger LOGGER = Logger.getLogger(TaskResource.class.getName());

    @GET
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GET
    @Path("/{id}")
    public Response getTaskById(@PathParam("id") Long id) {
        try {
            Task task = taskService.findTaskById(id);
            if (task != null) {
                return Response.ok(task).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("Task with id " + id + " not found").build();
            }
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @POST
    public Response createTask(@Valid Task task, @HeaderParam("X-CSRF-Token") String csrfToken) {
        try {
            if (!csrfTokenUtil.isValidCsrfToken(csrfToken)) {
                return Response.status(Response.Status.FORBIDDEN).entity("CSRF token is invalid").build();
            }

            // Validar que el usuario exista antes de asignarlo a la tarea
            User user = userService.findUserById(task.getUser().getId());
            if (user == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("User with id " + task.getUser().getId() + " not found").build();
            }

            Task createdTask = taskService.createTask(task);
            return Response.status(Response.Status.CREATED).entity(createdTask).build();
        } catch (Exception e) {
            LOGGER.severe("Error creating task: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateTask(@PathParam("id") Long id, @Valid Task task,
            @HeaderParam("X-CSRF-Token") String csrfToken) {
        try {
            if (!csrfTokenUtil.isValidCsrfToken(csrfToken)) {
                return Response.status(Response.Status.FORBIDDEN).entity("CSRF token is invalid").build();
            }

            Task updatedTask = taskService.updateTask(id, task);
            return Response.ok(updatedTask).build();
        } catch (Exception e) {
            LOGGER.severe("Error updating task: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deleteTask(@PathParam("id") Long id, @HeaderParam("X-CSRF-Token") String csrfToken) {
        try {
            if (!csrfTokenUtil.isValidCsrfToken(csrfToken)) {
                return Response.status(Response.Status.FORBIDDEN).entity("CSRF token is invalid").build();
            }

            taskService.deleteTask(id);
            return Response.status(Response.Status.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            LOGGER.severe("Error deleting task: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/user/{userId}")
    public List<Task> getTasksByUser(@PathParam("userId") Long userId) {
        User user = userService.findUserById(userId);
        if (user != null) {
            return taskService.getTasksByUser(user);
        } else {
            throw new NotFoundException("User with id " + userId + " not found");
        }
    }
}
