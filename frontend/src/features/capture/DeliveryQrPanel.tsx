import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface Props {
  imageUrl: string;
  onComplete: () => void;
}

export function DeliveryQrPanel({ imageUrl, onComplete }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(imageUrl, { margin: 1, width: 260 }).then(setQrDataUrl).catch(() => setQrDataUrl(""));
  }, [imageUrl]);

  return (
    <section className="panel">
      <h3>QR 코드를 스캔해서 다운로드하세요</h3>
      {qrDataUrl ? <img src={qrDataUrl} alt="download qr" style={{ width: 260, height: 260 }} /> : <p>QR 생성 중...</p>}
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={onComplete}>Complete</button>
      </div>
    </section>
  );
}
