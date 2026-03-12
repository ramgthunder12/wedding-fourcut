import { useCallback, useEffect, useRef, useState } from "react";

export function useCameraStream(enabled: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSupported] = useState(
    typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia)
  );
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
        setError(e instanceof Error ? e.message : "카메라 권한이 거부되었거나 장치를 찾을 수 없습니다.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [enabled, stopStream]);

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

  return { stream, error, isConnecting, isSupported, connectCamera };
}
