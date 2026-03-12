package com.weddingfourcut.api;

import com.weddingfourcut.model.CaptureModels;
import com.weddingfourcut.service.InMemoryStore;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {
    private final InMemoryStore store;

    public PhotoController(InMemoryStore store) {
        this.store = store;
    }

    @GetMapping("/{photoId}")
    @ResponseStatus(HttpStatus.OK)
    public CaptureModels.ComposedPhoto getPhoto(@PathVariable String photoId) {
        CaptureModels.ComposedPhoto photo = store.getPhoto(photoId);
        if (photo == null) {
            throw new IllegalArgumentException("Photo not found");
        }
        return photo;
    }
}
