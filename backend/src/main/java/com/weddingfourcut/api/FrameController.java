package com.weddingfourcut.api;

import com.weddingfourcut.model.SessionModels;
import com.weddingfourcut.service.InMemoryStore;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions/{sessionId}/frames")
public class FrameController {
    private final InMemoryStore store;

    public FrameController(InMemoryStore store) {
        this.store = store;
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
}
