import { FormEvent, useState } from "react";
import { createSession } from "../../services/sessionService";
import { FrameUploadPanel } from "./FrameUploadPanel";

interface Props {
  onReady: (sessionId: string) => void;
}

export function SetupPage({ onReady }: Props) {
  const [nickname, setNickname] = useState("");
  const [sessionId, setSessionId] = useState<string>("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) return;
    const session = await createSession(nickname.trim());
    setSessionId(session.sessionId);
  }

  return (
    <section className="panel">
      <h2>커플 세션 준비</h2>
      {!sessionId ? (
        <form onSubmit={submit}>
          <label htmlFor="nickname">닉네임</label>
          <input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          <div style={{ marginTop: 12 }}>
            <button type="submit">세션 만들기</button>
          </div>
        </form>
      ) : (
        <FrameUploadPanel sessionId={sessionId} onComplete={() => onReady(sessionId)} />
      )}
    </section>
  );
}
