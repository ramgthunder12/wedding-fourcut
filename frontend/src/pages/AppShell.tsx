import { useMemo, useState } from "react";
import { SetupPage } from "../features/frame-setup/SetupPage";
import { FrameSelectionPage } from "./FrameSelectionPage";
import { CapturePage } from "../features/capture/CapturePage";
import type { FrameTemplate } from "../services/sessionService";

export type AppStage = "SETUP" | "SELECT" | "CAPTURE";

export function AppShell() {
  const [stage, setStage] = useState<AppStage>("SETUP");
  const [sessionId, setSessionId] = useState<string>("");
  const [selectedFrame, setSelectedFrame] = useState<FrameTemplate | null>(null);

  const content = useMemo(() => {
    if (stage === "SETUP") {
      return <SetupPage onReady={(id) => {
        setSessionId(id);
        setStage("SELECT");
      }} />;
    }

    if (stage === "SELECT") {
      return <FrameSelectionPage sessionId={sessionId} onSelectFrame={(frame) => {
        setSelectedFrame(frame);
        setStage("CAPTURE");
      }} />;
    }

    return <CapturePage sessionId={sessionId} frame={selectedFrame} onReset={() => setStage("SELECT")} />;
  }, [stage, sessionId, selectedFrame]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <strong>Wedding Four Cut</strong>
      </header>
      <main className="container">{content}</main>
    </div>
  );
}
