package com.weddingfourcut.model;

import java.time.Instant;

public class SessionModels {
    public record CreateSessionRequest(String nickname) {}

    public record WeddingSession(
        String sessionId,
        String nickname,
        String status,
        Instant createdAt
    ) {}

    public record CreateFrameRequest(String name, String overlayImageUrl) {}

    public record FrameTemplate(
        String frameId,
        String sessionId,
        String name,
        String overlayImageUrl,
        boolean isActive
    ) {}
}
