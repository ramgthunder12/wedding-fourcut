package com.weddingfourcut.api;

import com.weddingfourcut.config.AppProperties;
import com.weddingfourcut.model.SessionModels;
import com.weddingfourcut.service.InMemoryStore;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/sessions/{sessionId}/frames")
public class FrameController {
    private final InMemoryStore store;
    private final AppProperties appProperties;

    public FrameController(InMemoryStore store, AppProperties appProperties) {
        this.store = store;
        this.appProperties = appProperties;
    }

    @GetMapping
    public Map<String, List<SessionModels.FrameTemplate>> list(@PathVariable String sessionId) {
        return Map.of("frames", store.getFrames(sessionId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionModels.FrameTemplate create(
        @PathVariable String sessionId,
        @RequestBody SessionModels.CreateFrameRequest request
    ) {
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Frame name is required");
        }
        if (request.overlayImageUrl() == null || request.overlayImageUrl().isBlank()) {
            throw new IllegalArgumentException("overlayImageUrl is required");
        }
        return store.addFrame(sessionId, request.name().trim(), request.overlayImageUrl().trim());
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public SessionModels.FrameTemplate uploadFrame(
        @PathVariable String sessionId,
        @RequestParam String name,
        @RequestParam("frameImage") MultipartFile frameImage
    ) throws IOException {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Frame name is required");
        }
        if (frameImage == null || frameImage.isEmpty()) {
            throw new IllegalArgumentException("frameImage is required");
        }
        String contentType = frameImage.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("frameImage must be an image");
        }

        Path uploadDir = Paths.get(appProperties.getUploadDir());
        Files.createDirectories(uploadDir);

        String ext = ".png";
        String originalName = frameImage.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf('.'));
        }

        String filename = "frame-" + UUID.randomUUID() + ext;
        Path target = uploadDir.resolve(filename);
        Files.copy(frameImage.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String overlayImageUrl = "/uploads/" + filename;
        return store.addFrame(sessionId, name.trim(), overlayImageUrl);
    }
}
