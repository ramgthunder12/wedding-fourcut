export type CaptureStage = "PREVIEW" | "CAPTURING" | "UPLOADING" | "DELIVERED";

export interface CaptureState {
  stage: CaptureStage;
  isBusy: boolean;
}

export function nextCaptureState(current: CaptureState, event: "CAPTURE" | "UPLOADED" | "RESET"): CaptureState {
  if (event === "CAPTURE") return { stage: "CAPTURING", isBusy: true };
  if (event === "UPLOADED") return { stage: "DELIVERED", isBusy: false };
  return { stage: "PREVIEW", isBusy: false };
}
