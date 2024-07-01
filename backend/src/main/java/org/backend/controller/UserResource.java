package org.backend.controller;

import org.backend.dto.LoginDTO;
import org.backend.dto.UserDTO;
import org.backend.entity.User;
import org.backend.exeption.UnauthorizedException;
import org.backend.service.AuthService;
import org.backend.service.UserService;
import org.backend.util.CsrfTokenUtil;
import org.backend.util.RSAEncryptionUtil;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.security.KeyPair;
import java.util.List;
import java.util.logging.Logger;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserService userService;

    @Inject
    private AuthService authService;

    @Inject
    private RSAEncryptionUtil rsaEncryptionUtil;

    @Inject
    private CsrfTokenUtil csrfTokenUtil;

    

    private static final Logger LOGGER = Logger.getLogger(UserResource.class.getName());

    @GET
    public List<User> getAllUsers(@HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);
        
        return userService.getAllUsers();
    }

    @GET
    @Path("/{id}")
    public Response getUserById(@PathParam("id") Long id, @HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);
        try {
            User user = userService.findUserById(id);
            if (user != null) {
                return Response.ok(user).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("User with id " + id + " not found").build();
            }
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @POST
    public Response createUser(@Valid UserDTO userDTO) {
        if (userService.isUsernameTaken(userDTO.getUsername())) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Username '" + userDTO.getUsername() + "' is already taken")
                    .build();
        }

        try {
            KeyPair keyPair = rsaEncryptionUtil.generateRSAKeys();

            String encryptedPassword = rsaEncryptionUtil.encryptPassword(userDTO.getPassword(), keyPair.getPublic());
            userDTO.setPassword(encryptedPassword);

            User user = mapUserDTOToEntity(userDTO);

            user.setPublicKeyBase64(rsaEncryptionUtil.getPublicKeyBase64(keyPair.getPublic()));
            user.setPrivateKeyBase64(rsaEncryptionUtil.getPrivateKeyBase64(keyPair.getPrivate()));

            userService.createUser(user);

            user.setPrivateKeyBase64(null);
            user.setPublicKeyBase64(null);
            user.setPassword(null);
            return Response.status(Response.Status.CREATED).entity(user).build();
        } catch (Exception e) {
            LOGGER.severe("Error creating user: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/login")
    public Response loginUser(UserDTO userDTO) {
        try {
            User user = authService.authenticate(userDTO.getUsername(), userDTO.getPassword());
            if (user != null) {
                KeyPair keyPair = rsaEncryptionUtil.getKeyPairFromBase64(user.getPublicKeyBase64(), user.getPrivateKeyBase64());
                if (keyPair == null) {
                    return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid keys").build();
                }

                String csrfToken = csrfTokenUtil.generateCsrfToken();

                user.setPrivateKeyBase64(null);
                user.setPublicKeyBase64(null);
                user.setPassword(null);

                LoginDTO loginResponse = new LoginDTO(user, csrfToken);

                return Response.ok(loginResponse).build();
            } else {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid credentials").build();
            }
        } catch (Exception e) {
            LOGGER.severe("Error during login: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") Long id, @Valid UserDTO userDTO,  @HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);

        try {
            User updatedUser = userService.updateUser(id, userDTO);
            return Response.ok(updatedUser).build();
        } catch (Exception e) {
            LOGGER.severe("Error updating user: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deleteUser(@PathParam("id") Long id, @HeaderParam("X-CSRF-Token") String csrfToken) {
        validateCsrfToken(csrfToken);

        try {
            userService.deleteUser(id);
            return Response.status(Response.Status.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    private User mapUserDTOToEntity(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setAge(userDTO.getAge());
        user.setGender(userDTO.getGender());
        user.setPassword(userDTO.getPassword());
        return user;
    }

     private void validateCsrfToken(String csrfToken) {
        if (!csrfTokenUtil.isValidCsrfToken(csrfToken)) {
            throw new UnauthorizedException("CSRF token is invalid");
        }
    }
}
