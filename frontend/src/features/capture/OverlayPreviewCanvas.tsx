import { useEffect, useRef, type RefObject } from "react";
import { resolveAssetUrl } from "../../utils/resolveAssetUrl";

interface Props {
  stream: MediaStream | null;
  overlayImageUrl?: string;
  videoRef?: RefObject<HTMLVideoElement>;
}

export function OverlayPreviewCanvas({ stream, overlayImageUrl, videoRef: externalVideoRef }: Props) {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = externalVideoRef ?? internalVideoRef;
  const resolvedOverlayUrl = overlayImageUrl ? resolveAssetUrl(overlayImageUrl) : "";

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(() => undefined);
  }, [stream]);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", overflow: "hidden", borderRadius: 16, background: "#000" }}>
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        style={{ position: "absolute", inset: 0, zIndex: 1, width: "100%", height: "100%", objectFit: "cover" }}
      />
      {stream && resolvedOverlayUrl ? (
        <img
          src={resolvedOverlayUrl}
          alt="frame overlay"
          style={{ position: "absolute", inset: 0, zIndex: 2, width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, pointerEvents: "none" }}
        />
      ) : null}
    </div>
  );
}
