package com.weddingfourcut.model;

import java.time.Instant;

public class CaptureModels {
    public record CaptureDeliveryResponse(String captureId, String photoId, String imageUrl) {}

    public record ComposedPhoto(
        String photoId,
        String sessionId,
        String frameId,
        String publicUrl,
        Instant createdAt
    ) {}
}
