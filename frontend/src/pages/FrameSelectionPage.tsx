import { useEffect, useState } from "react";
import { getFrames, type FrameTemplate } from "../services/sessionService";

interface Props {
  sessionId: string;
  onSelectFrame: (frame: FrameTemplate) => void;
}

export function FrameSelectionPage({ sessionId, onSelectFrame }: Props) {
  const [frames, setFrames] = useState<FrameTemplate[]>([]);

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
          <button key={frame.frameId} onClick={() => onSelectFrame(frame)}>
            {frame.name}
          </button>
        ))}
      </div>
    </section>
  );
}
