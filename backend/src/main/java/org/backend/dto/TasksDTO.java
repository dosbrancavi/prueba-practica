package org.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.core.MediaType;
import lombok.Data;

import java.io.InputStream;

import org.jboss.resteasy.annotations.providers.multipart.PartType;

@Data
public class TasksDTO {

    @NotBlank
    @FormParam("description")
    private String description;

    @NotBlank
    @FormParam("status")
    private String status;

    @FormParam("imageFile")
    @PartType(MediaType.APPLICATION_OCTET_STREAM)
    private InputStream imageFile;

    @FormParam("imageUrl")
    private String imageUrl;
}
