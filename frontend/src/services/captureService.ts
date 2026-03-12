import { apiRequest } from "./apiClient";

export interface CaptureResponse {
  captureId: string;
  photoId: string;
  imageUrl: string;
}

export async function uploadComposedImage(sessionId: string, frameId: string, blob: Blob): Promise<CaptureResponse> {
  const form = new FormData();
  form.append("sessionId", sessionId);
  form.append("frameId", frameId);
  form.append("composedImage", blob, "capture.jpg");
  return apiRequest<CaptureResponse>("/api/captures", "POST", form);
}
