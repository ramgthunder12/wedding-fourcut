import { useEffect, useState } from "react";

export function useCameraStream(enabled: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let localStream: MediaStream | null = null;

    async function start() {
      if (!enabled) return;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false
        });
        setStream(localStream);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Camera permission denied");
      }
    }

    start();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [enabled]);

  return { stream, error };
}
