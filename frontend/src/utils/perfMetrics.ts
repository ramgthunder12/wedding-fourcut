export interface CaptureMetric {
  previewFps: number;
  captureToQrMs: number;
}

const metrics: CaptureMetric[] = [];

export function recordMetric(metric: CaptureMetric) {
  metrics.push(metric);
}

export function getMetrics(): CaptureMetric[] {
  return [...metrics];
}
