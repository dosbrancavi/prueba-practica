package org.backend.exeption;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class UnauthorizedExceptionHandler implements ExceptionMapper<UnauthorizedException> {

    @Override
    public Response toResponse(UnauthorizedException exception) {
        return Response.status(Response.Status.UNAUTHORIZED)
                       .entity(exception.getMessage())
                       .build();
    }
}


