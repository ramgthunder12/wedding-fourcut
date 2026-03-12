import { apiRequest } from "./apiClient";
import type { FrameTemplate } from "./sessionService";

export interface CreateFrameRequest {
  name: string;
  overlayImageUrl: string;
}

export async function createFrame(sessionId: string, payload: CreateFrameRequest): Promise<FrameTemplate> {
  return apiRequest<FrameTemplate>(`/api/sessions/${sessionId}/frames`, "POST", payload);
}

export async function uploadFrameFile(sessionId: string, name: string, file: File): Promise<FrameTemplate> {
  const form = new FormData();
  form.append("name", name);
  form.append("frameImage", file, file.name);
  return apiRequest<FrameTemplate>(`/api/sessions/${sessionId}/frames/upload`, "POST", form);
}
