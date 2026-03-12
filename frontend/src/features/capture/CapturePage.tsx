import { useEffect, useRef, useState } from "react";
import type { FrameTemplate } from "../../services/sessionService";
import { uploadComposedImage } from "../../services/captureService";
import type { CaptureState } from "./captureState";
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
  const [state, setState] = useState<CaptureState>({ stage: "PREVIEW", isBusy: false });
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, error, isConnecting, isSupported, connectCamera } = useCameraStream(Boolean(sessionId));

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
      <p>
        {!isSupported
          ? "이 브라우저는 카메라를 지원하지 않습니다."
          : isConnecting
            ? "카메라 연결 중..."
            : stream
              ? "카메라 연결됨"
              : "카메라 연결 필요"}
      </p>
      <div style={{ marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => void connectCamera()}
          disabled={!isSupported || isConnecting}
        >
          {stream ? "다시 연결" : "카메라 연결"}
        </button>
      </div>
      {!stream && (
        <p>
          태블릿 브라우저에서 카메라 권한을 허용해 주세요. 외부 기기에서는 HTTPS 환경이 필요할 수 있습니다.
        </p>
      )}
      {error && <p>카메라 오류: {error}</p>}
      <div style={{ position: "relative" }}>
        <OverlayPreviewCanvas stream={stream} overlayImageUrl={frame?.overlayImageUrl} videoRef={videoRef} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={capture} disabled={state.isBusy || isConnecting || !stream || !frame}>촬영</button>
      </div>
    </section>
  );
}
