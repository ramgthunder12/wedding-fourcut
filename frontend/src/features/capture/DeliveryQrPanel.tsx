import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { resolveAssetUrl } from "../../utils/resolveAssetUrl";

interface Props {
  imageUrl: string;
  onComplete: () => void;
}

export function DeliveryQrPanel({ imageUrl, onComplete }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const resolvedImageUrl = useMemo(() => {
    const normalized = resolveAssetUrl(imageUrl);
    try {
      return new URL(normalized, window.location.origin).toString();
    } catch {
      return normalized;
    }
  }, [imageUrl]);
  const downloadUrl = useMemo(() => {
    try {
      const parsed = new URL(resolvedImageUrl, window.location.origin);
      const fileName = parsed.pathname.split("/").filter(Boolean).pop();
      if (!fileName) return "";
      return `/api/downloads/${encodeURIComponent(fileName)}`;
    } catch {
      return "";
    }
  }, [resolvedImageUrl]);

  useEffect(() => {
    QRCode.toDataURL(resolvedImageUrl, { margin: 1, width: 260 }).then(setQrDataUrl).catch(() => setQrDataUrl(""));
  }, [resolvedImageUrl]);

  async function downloadImage() {
    setIsDownloading(true);
    setDownloadError("");
    try {
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const directLink = document.createElement("a");
      directLink.href = resolvedImageUrl;
      directLink.download = `wedding-fourcut-${Date.now()}.jpg`;
      directLink.rel = "noopener";
      document.body.appendChild(directLink);
      directLink.click();
      document.body.removeChild(directLink);

      // Some mobile browsers ignore `download` for cross-origin/blob URLs.
      // Fallback to fetch+blob and, if needed, open in a new tab.
      const response = await fetch(resolvedImageUrl, { credentials: "include" });
      if (!response.ok) throw new Error("다운로드 요청에 실패했습니다.");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `wedding-fourcut-${Date.now()}.jpg`;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      window.open(resolvedImageUrl, "_blank", "noopener,noreferrer");
      setDownloadError(e instanceof Error ? `${e.message} 새 탭에서 이미지를 열었습니다.` : "이미지 다운로드에 실패해 새 탭에서 열었습니다.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section className="panel">
      <h3>QR 코드를 스캔해서 다운로드하세요</h3>
      {qrDataUrl ? <img src={qrDataUrl} alt="download qr" style={{ width: 260, height: 260 }} /> : <p>QR 생성 중...</p>}
      <p style={{ marginTop: 8, wordBreak: "break-all" }}>{resolvedImageUrl}</p>
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={() => void downloadImage()} disabled={isDownloading}>
          {isDownloading ? "다운로드 중..." : "이미지 다운로드"}
        </button>
      </div>
      <div style={{ marginTop: 8 }}>
        <a href={downloadUrl || resolvedImageUrl} target="_blank" rel="noreferrer noopener" download>
          새 탭에서 이미지 열기
        </a>
      </div>
      {downloadError ? <p style={{ color: "#b42318" }}>다운로드 오류: {downloadError}</p> : null}
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={onComplete}>Complete</button>
      </div>
    </section>
  );
}
