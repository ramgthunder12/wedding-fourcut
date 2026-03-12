import { useEffect, useState } from "react";
import { getFrames, type FrameTemplate } from "../services/sessionService";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";

interface Props {
  sessionId: string;
  onSelectFrame: (frame: FrameTemplate) => void;
}

export function FrameSelectionPage({ sessionId, onSelectFrame }: Props) {
  const [frames, setFrames] = useState<FrameTemplate[]>([]);
  const [selectedFrameId, setSelectedFrameId] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      setFrames([]);
      return;
    }
    getFrames(sessionId).then((res) => setFrames(res.frames)).catch(() => setFrames([]));
  }, [sessionId]);

  return (
    <section className="panel">
      <h2>프레임 선택</h2>
      {frames.length === 0 && <p>아직 준비된 프레임이 없습니다.</p>}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
        {frames.map((frame) => (
          <button
            key={frame.frameId}
            onClick={() => {
              setSelectedFrameId(frame.frameId);
              onSelectFrame(frame);
            }}
            style={{
              padding: 8,
              borderRadius: 12,
              border: selectedFrameId === frame.frameId ? "2px solid #f43f5e" : "1px solid #d1d5db",
              background: "#fff",
              textAlign: "left"
            }}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", overflow: "hidden", borderRadius: 8, background: "#111" }}>
              <img
                src={resolveAssetUrl(frame.overlayImageUrl)}
                alt={`${frame.name} 미리보기`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>{frame.name}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
