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

  useEffect(() => {
    QRCode.toDataURL(resolvedImageUrl, { margin: 1, width: 260 }).then(setQrDataUrl).catch(() => setQrDataUrl(""));
  }, [resolvedImageUrl]);

  async function downloadImage() {
    setIsDownloading(true);
    setDownloadError("");
    try {
      const response = await fetch(resolvedImageUrl);
      if (!response.ok) {
        throw new Error("다운로드 요청에 실패했습니다.");
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `wedding-fourcut-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : "이미지 다운로드에 실패했습니다.");
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
      {downloadError ? <p style={{ color: "#b42318" }}>다운로드 오류: {downloadError}</p> : null}
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={onComplete}>Complete</button>
      </div>
    </section>
  );
}
