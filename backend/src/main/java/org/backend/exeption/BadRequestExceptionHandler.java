package org.backend.exeption;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class BadRequestExceptionHandler implements ExceptionMapper<IllegalArgumentException> {

    @Override
    public Response toResponse(IllegalArgumentException exception) {
        return Response.status(Response.Status.BAD_REQUEST)
                       .entity(exception.getMessage())
                       .build();
    }
}
