package com.weddingfourcut.api;

import com.weddingfourcut.model.SessionModels;
import com.weddingfourcut.service.InMemoryStore;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    private final InMemoryStore store;

    public SessionController(InMemoryStore store) {
        this.store = store;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionModels.WeddingSession createSession(@RequestBody SessionModels.CreateSessionRequest request) {
        if (request.nickname() == null || request.nickname().trim().length() < 2) {
            throw new IllegalArgumentException("Nickname must be at least 2 characters");
        }
        return store.createSession(request.nickname().trim());
    }
}
