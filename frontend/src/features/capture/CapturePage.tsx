import { useEffect, useRef, useState } from "react";
import type { FrameTemplate } from "../../services/sessionService";
import { uploadComposedImage } from "../../services/captureService";
import { nextCaptureState } from "./captureState";
import { useCameraStream } from "./useCameraStream";
import { OverlayPreviewCanvas } from "./OverlayPreviewCanvas";
import { DeliveryQrPanel } from "./DeliveryQrPanel";
import { useSessionReset } from "./useSessionReset";

interface Props {
  sessionId: string;
  frame: FrameTemplate | null;
  onReset: () => void;
}

export function CapturePage({ sessionId, frame, onReset }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [state, setState] = useState<{ stage: "PREVIEW" | "CAPTURING" | "DELIVERED"; isBusy: boolean }>({ stage: "PREVIEW", isBusy: false });
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, error } = useCameraStream(Boolean(sessionId));

  useSessionReset(Boolean(imageUrl), 10_000, onReset);

  useEffect(() => {
    setState({ stage: "PREVIEW", isBusy: false });
  }, [sessionId, frame?.frameId]);

  async function capture() {
    if (!stream || !frame || state.isBusy || !videoRef.current) return;
    setState((prev) => nextCaptureState(prev, "CAPTURE"));

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (!blob) return;

    const result = await uploadComposedImage(sessionId, frame.frameId, blob);
    setImageUrl(result.imageUrl);
    setState((prev) => nextCaptureState(prev, "UPLOADED"));
  }

  if (imageUrl) {
    return <DeliveryQrPanel imageUrl={imageUrl} onComplete={onReset} />;
  }

  return (
    <section className="panel">
      <h2>촬영하기</h2>
      {error && <p>{error}</p>}
      <div style={{ position: "relative" }}>
        <OverlayPreviewCanvas stream={stream} overlayImageUrl={frame?.overlayImageUrl} videoRef={videoRef} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={capture} disabled={state.isBusy || !frame}>촬영</button>
      </div>
    </section>
  );
}
