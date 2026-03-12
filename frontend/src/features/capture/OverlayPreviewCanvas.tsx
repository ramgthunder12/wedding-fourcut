import { useEffect, useRef, type RefObject } from "react";

interface Props {
  stream: MediaStream | null;
  overlayImageUrl?: string;
  videoRef?: RefObject<HTMLVideoElement>;
}

export function OverlayPreviewCanvas({ stream, overlayImageUrl, videoRef: externalVideoRef }: Props) {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = externalVideoRef ?? internalVideoRef;

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(() => undefined);
  }, [stream]);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", overflow: "hidden", borderRadius: 16 }}>
      <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {overlayImageUrl ? (
        <img
          src={overlayImageUrl}
          alt="frame overlay"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
        />
      ) : null}
    </div>
  );
}
