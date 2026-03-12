import { apiRequest } from "./apiClient";
import type { FrameTemplate } from "./sessionService";

export interface CreateFrameRequest {
  name: string;
  overlayImageUrl: string;
}

export async function createFrame(sessionId: string, payload: CreateFrameRequest): Promise<FrameTemplate> {
  return apiRequest<FrameTemplate>(`/api/sessions/${sessionId}/frames`, "POST", payload);
}
