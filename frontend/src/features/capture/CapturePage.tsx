import { useEffect, useRef, useState } from "react";
import type { FrameTemplate } from "../../services/sessionService";
import { uploadComposedImage } from "../../services/captureService";
import type { CaptureState } from "./captureState";
import { nextCaptureState } from "./captureState";
import { useCameraStream } from "./useCameraStream";
import { OverlayPreviewCanvas } from "./OverlayPreviewCanvas";
import { DeliveryQrPanel } from "./DeliveryQrPanel";
import { useSessionReset } from "./useSessionReset";
import { resolveAssetUrl } from "../../utils/resolveAssetUrl";

interface Props {
  sessionId: string;
  frame: FrameTemplate | null;
  onReset: () => void;
}

const OUTPUT_WIDTH = 720;
const OUTPUT_HEIGHT = 960;
const FRAME_OPACITY = 0.75;

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("프레임 이미지를 불러오지 못했습니다."));
    image.src = url;
  });
}

export function CapturePage({ sessionId, frame, onReset }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [captureError, setCaptureError] = useState("");
  const [state, setState] = useState<CaptureState>({ stage: "PREVIEW", isBusy: false });
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, error, isConnecting, isSupported, isSecure, connectCamera } = useCameraStream(Boolean(sessionId));

  useSessionReset(Boolean(imageUrl), 10_000, onReset);

  useEffect(() => {
    setState({ stage: "PREVIEW", isBusy: false });
  }, [sessionId, frame?.frameId]);

  async function capture() {
    if (!stream || !frame || state.isBusy || !videoRef.current) return;
    setCaptureError("");
    setState((prev) => nextCaptureState(prev, "CAPTURE"));

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match CSS object-fit: cover behavior used by preview video.
    const sourceWidth = videoRef.current.videoWidth || OUTPUT_WIDTH;
    const sourceHeight = videoRef.current.videoHeight || OUTPUT_HEIGHT;
    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = OUTPUT_WIDTH / OUTPUT_HEIGHT;
    let sx = 0;
    let sy = 0;
    let sw = sourceWidth;
    let sh = sourceHeight;

    if (sourceRatio > targetRatio) {
      sw = sourceHeight * targetRatio;
      sx = (sourceWidth - sw) / 2;
    } else {
      sh = sourceWidth / targetRatio;
      sy = (sourceHeight - sh) / 2;
    }

    ctx.drawImage(videoRef.current, sx, sy, sw, sh, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

    if (frame.overlayImageUrl) {
      try {
        const overlay = await loadImage(resolveAssetUrl(frame.overlayImageUrl));
        ctx.save();
        ctx.globalAlpha = FRAME_OPACITY;
        ctx.drawImage(overlay, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);
        ctx.restore();
      } catch (e) {
        setCaptureError(e instanceof Error ? e.message : "프레임 합성에 실패했습니다.");
        setState((prev) => nextCaptureState(prev, "RESET"));
        return;
      }
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (!blob) {
      setCaptureError("이미지 생성에 실패했습니다.");
      setState((prev) => nextCaptureState(prev, "RESET"));
      return;
    }

    try {
      const result = await uploadComposedImage(sessionId, frame.frameId, blob);
      setImageUrl(result.imageUrl);
      setState((prev) => nextCaptureState(prev, "UPLOADED"));
    } catch (e) {
      setCaptureError(e instanceof Error ? e.message : "촬영본 저장에 실패했습니다.");
      setState((prev) => nextCaptureState(prev, "RESET"));
    }
  }

  if (imageUrl) {
    return <DeliveryQrPanel imageUrl={imageUrl} onComplete={onReset} />;
  }

  return (
    <section className="panel">
      <h2>촬영하기</h2>
      <p>
        {!isSecure
          ? "카메라를 사용하려면 HTTPS 접속이 필요합니다."
          : !isSupported
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
          disabled={!isSecure || !isSupported || isConnecting}
        >
          {stream ? "다시 연결" : "카메라 연결"}
        </button>
      </div>
      {!stream && (
        <p>
          태블릿 브라우저에서 카메라 권한을 허용해 주세요. 같은 Wi-Fi에서 접속 중이라면 http 대신 https 주소로 열어야 동작합니다.
        </p>
      )}
      {error && <p>카메라 오류: {error}</p>}
      {captureError && <p>촬영 오류: {captureError}</p>}
      <div style={{ position: "relative" }}>
        <OverlayPreviewCanvas stream={stream} overlayImageUrl={frame?.overlayImageUrl} videoRef={videoRef} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={capture} disabled={state.isBusy || isConnecting || !stream || !frame}>촬영</button>
      </div>
    </section>
  );
}
