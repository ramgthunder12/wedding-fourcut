package com.weddingfourcut.service;

import com.weddingfourcut.model.CaptureModels;
import com.weddingfourcut.model.SessionModels;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class InMemoryStore {
    private final Map<String, SessionModels.WeddingSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, List<SessionModels.FrameTemplate>> framesBySession = new ConcurrentHashMap<>();
    private final Map<String, CaptureModels.ComposedPhoto> photos = new ConcurrentHashMap<>();

    public SessionModels.WeddingSession createSession(String nickname) {
        String sessionId = UUID.randomUUID().toString();
        SessionModels.WeddingSession session = new SessionModels.WeddingSession(
            sessionId,
            nickname,
            "SETUP",
            Instant.now()
        );
        sessions.put(sessionId, session);
        framesBySession.put(sessionId, new ArrayList<>());
        return session;
    }

    public SessionModels.WeddingSession getSession(String sessionId) {
        return sessions.get(sessionId);
    }

    public SessionModels.FrameTemplate addFrame(String sessionId, String name, String overlayImageUrl) {
        SessionModels.WeddingSession session = sessions.get(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Session not found");
        }

        SessionModels.FrameTemplate frame = new SessionModels.FrameTemplate(
            UUID.randomUUID().toString(),
            sessionId,
            name,
            overlayImageUrl,
            true
        );

        framesBySession.computeIfAbsent(sessionId, key -> new ArrayList<>()).add(frame);

        sessions.put(sessionId, new SessionModels.WeddingSession(
            session.sessionId(),
            session.nickname(),
            "READY",
            session.createdAt()
        ));

        return frame;
    }

    public List<SessionModels.FrameTemplate> getFrames(String sessionId) {
        return framesBySession.getOrDefault(sessionId, List.of());
    }

    public CaptureModels.ComposedPhoto saveComposedPhoto(String sessionId, String frameId, String publicUrl) {
        CaptureModels.ComposedPhoto photo = new CaptureModels.ComposedPhoto(
            UUID.randomUUID().toString(),
            sessionId,
            frameId,
            publicUrl,
            Instant.now()
        );
        photos.put(photo.photoId(), photo);
        return photo;
    }

    public CaptureModels.ComposedPhoto getPhoto(String photoId) {
        return photos.get(photoId);
    }
}
