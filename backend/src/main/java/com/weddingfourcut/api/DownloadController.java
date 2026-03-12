package com.weddingfourcut.api;

import com.weddingfourcut.config.AppProperties;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/downloads")
public class DownloadController {
    private final AppProperties appProperties;

    public DownloadController(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> download(@PathVariable String fileName) throws IOException {
        if (fileName == null || fileName.isBlank() || !fileName.matches("[a-zA-Z0-9._-]+")) {
            throw new IllegalArgumentException("Invalid file name");
        }

        Path uploadDir = Paths.get(appProperties.getUploadDir()).toAbsolutePath().normalize();
        Path filePath = uploadDir.resolve(fileName).normalize();
        if (!filePath.startsWith(uploadDir) || !Files.exists(filePath)) {
            throw new IllegalArgumentException("File not found");
        }

        Resource resource = new UrlResource(filePath.toUri());
        String mimeType = Files.probeContentType(filePath);
        if (mimeType == null) {
            mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
            .contentType(MediaType.parseMediaType(mimeType))
            .body(resource);
    }
}
