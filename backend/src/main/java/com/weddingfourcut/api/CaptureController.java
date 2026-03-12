package com.weddingfourcut.api;

import com.weddingfourcut.config.AppProperties;
import com.weddingfourcut.model.CaptureModels;
import com.weddingfourcut.service.InMemoryStore;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/captures")
public class CaptureController {
    private final InMemoryStore store;
    private final AppProperties appProperties;

    public CaptureController(InMemoryStore store, AppProperties appProperties) {
        this.store = store;
        this.appProperties = appProperties;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaptureModels.CaptureDeliveryResponse upload(
        @RequestParam String sessionId,
        @RequestParam String frameId,
        @RequestParam("composedImage") MultipartFile composedImage
    ) throws IOException {
        if (composedImage.isEmpty()) {
            throw new IllegalArgumentException("composedImage is required");
        }

        Path dir = Paths.get(appProperties.getUploadDir());
        Files.createDirectories(dir);
        String ext = ".jpg";
        String original = composedImage.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String filename = UUID.randomUUID() + ext;
        Path target = dir.resolve(filename);
        Files.copy(composedImage.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        String imageUrl = baseUrl + "/uploads/" + filename;
        CaptureModels.ComposedPhoto photo = store.saveComposedPhoto(sessionId, frameId, imageUrl);
        return new CaptureModels.CaptureDeliveryResponse(UUID.randomUUID().toString(), photo.photoId(), imageUrl);
    }
}
