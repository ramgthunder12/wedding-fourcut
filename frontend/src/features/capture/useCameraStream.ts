import { useCallback, useEffect, useRef, useState } from "react";

export function useCameraStream(enabled: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSecure] = useState(typeof window !== "undefined" && window.isSecureContext);
  const [isSupported] = useState(typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia));
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStream(null);
  }, []);

  const connectCamera = useCallback(async () => {
    if (!enabled) return;
    if (!isSecure) {
      setError("보안 연결(HTTPS)에서만 카메라를 사용할 수 있습니다.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("이 브라우저는 카메라를 지원하지 않습니다.");
      return;
    }

    setIsConnecting(true);
    setError("");
    stopStream();

    try {
      // 1차 시도: 전면 카메라 우선 (태블릿 셀피 뷰)
      const preferred = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = preferred;
      setStream(preferred);
    } catch {
      try {
        // 2차 시도: 제약 완화
        const fallback = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        streamRef.current = fallback;
        setStream(fallback);
      } catch (e) {
        if (e instanceof DOMException) {
          if (e.name === "NotAllowedError") {
            setError("카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해 주세요.");
          } else if (e.name === "NotFoundError") {
            setError("사용 가능한 카메라 장치를 찾을 수 없습니다.");
          } else {
            setError(e.message || "카메라 연결에 실패했습니다.");
          }
        } else {
          setError(e instanceof Error ? e.message : "카메라 권한이 거부되었거나 장치를 찾을 수 없습니다.");
        }
      }
    } finally {
      setIsConnecting(false);
    }
  }, [enabled, isSecure, stopStream]);

  useEffect(() => {
    if (enabled) {
      connectCamera();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [enabled, connectCamera, stopStream]);

  return { stream, error, isConnecting, isSupported, isSecure, connectCamera };
}
