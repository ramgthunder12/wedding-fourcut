package com.weddingfourcut.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CaptureControllerContractTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void uploadReturnsImageUrl() throws Exception {
        MockMultipartFile file = new MockMultipartFile("composedImage", "capture.jpg", "image/jpeg", "abc".getBytes());

        mockMvc.perform(multipart("/api/captures")
                .file(file)
                .param("sessionId", "session-1")
                .param("frameId", "frame-1"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.imageUrl").exists())
            .andExpect(jsonPath("$.photoId").exists());
    }
}
