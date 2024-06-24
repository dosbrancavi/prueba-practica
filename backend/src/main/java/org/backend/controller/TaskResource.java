package org.backend.controller;

import org.backend.entity.Task;
import org.backend.entity.User;
import org.backend.exeption.UnauthorizedException;
import org.backend.service.TaskService;
import org.backend.util.CsrfTokenUtil;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
    public Response createTask(@Valid Task task, @HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);
        Task createdTask = taskService.createTask(task);
        return Response.status(Response.Status.CREATED).entity(createdTask).build();
    }

    @PUT
    public Response updateTask(@Valid Task task,
                               @HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);
        
        // Obtén el ID de la tarea del objeto task
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
