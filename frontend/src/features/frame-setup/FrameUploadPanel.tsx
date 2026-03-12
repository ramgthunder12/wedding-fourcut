import { useState } from "react";
import { createFrame } from "../../services/frameService";

interface Props {
  sessionId: string;
  onComplete: () => void;
}

export function FrameUploadPanel({ sessionId, onComplete }: Props) {
  const [name, setName] = useState("Frame 1");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80");
  const [creating, setCreating] = useState(false);

  async function addFrame() {
    setCreating(true);
    try {
      await createFrame(sessionId, { name, overlayImageUrl: imageUrl });
      onComplete();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h3>프레임 만들기</h3>
      <label htmlFor="frameName">프레임 이름</label>
      <input id="frameName" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="imageUrl">오버레이 이미지 URL</label>
      <input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={addFrame} disabled={creating}>
          {creating ? "생성 중..." : "프레임 생성 완료"}
        </button>
      </div>
    </div>
  );
}
