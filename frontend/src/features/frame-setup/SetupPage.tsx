import { FormEvent, useState } from "react";
import { createSession } from "../../services/sessionService";
import { FrameUploadPanel } from "./FrameUploadPanel";

interface Props {
  onReady: (sessionId: string) => void;
}

export function SetupPage({ onReady }: Props) {
  const [nickname, setNickname] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!nickname.trim() || isCreating) return;
    setIsCreating(true);
    setError("");
    try {
      const session = await createSession(nickname.trim());
      setSessionId(session.sessionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "세션 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="panel">
      <h2>커플 세션 준비</h2>
      {!sessionId ? (
        <form onSubmit={submit}>
          <label htmlFor="nickname">닉네임</label>
          <input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          {error ? <p style={{ color: "#b42318" }}>세션 오류: {error}</p> : null}
          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={isCreating || !nickname.trim()}>
              {isCreating ? "세션 생성 중..." : "세션 만들기"}
            </button>
          </div>
        </form>
      ) : (
        <FrameUploadPanel sessionId={sessionId} onComplete={() => onReady(sessionId)} />
      )}
    </section>
  );
}
