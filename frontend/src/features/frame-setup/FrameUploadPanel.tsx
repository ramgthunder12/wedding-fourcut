import { useState } from "react";
import { uploadFrameFile } from "../../services/frameService";

interface Props {
  sessionId: string;
  onComplete: () => void;
}

export function FrameUploadPanel({ sessionId, onComplete }: Props) {
  const [name, setName] = useState("Frame 1");
  const [frameFile, setFrameFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function addFrame() {
    if (!frameFile) {
      setError("프레임 이미지를 선택해 주세요.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      await uploadFrameFile(sessionId, name, frameFile);
      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "프레임 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h3>프레임 만들기</h3>
      <label htmlFor="frameName">프레임 이름</label>
      <input id="frameName" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="frameFile">커플 프레임 이미지 업로드</label>
      <input
        id="frameFile"
        type="file"
        accept="image/*"
        onChange={(e) => setFrameFile(e.target.files?.[0] ?? null)}
      />
      {frameFile ? <p>선택됨: {frameFile.name}</p> : null}
      {error ? <p style={{ color: "#b42318" }}>{error}</p> : null}
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={addFrame} disabled={creating}>
          {creating ? "생성 중..." : "프레임 생성 완료"}
        </button>
      </div>
    </div>
  );
}
