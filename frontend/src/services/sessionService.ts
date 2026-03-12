import { apiRequest } from "./apiClient";

export interface WeddingSession {
  sessionId: string;
  nickname: string;
  status: "SETUP" | "READY" | "ACTIVE" | "ARCHIVED";
  createdAt: string;
}

export interface FrameTemplate {
  frameId: string;
  sessionId: string;
  name: string;
  overlayImageUrl: string;
  isActive: boolean;
}

export async function createSession(nickname: string): Promise<WeddingSession> {
  return apiRequest<WeddingSession>("/api/sessions", "POST", { nickname });
}

export async function getFrames(sessionId: string): Promise<{ frames: FrameTemplate[] }> {
  return apiRequest<{ frames: FrameTemplate[] }>(`/api/sessions/${sessionId}/frames`, "GET");
}
