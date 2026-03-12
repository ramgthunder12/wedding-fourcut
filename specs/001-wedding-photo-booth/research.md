# Phase 0 Research: Wedding Four Cut

## Decision 1: Frontend camera stack uses getUserMedia + HTML canvas composition
- Decision: Implement live preview via `navigator.mediaDevices.getUserMedia` and final composition via offscreen/on-screen canvas draw pipeline.
- Rationale: Browser-native APIs work on modern tablets and iPads without app installation, matching the product constraint of pure web deployment.
- Alternatives considered: WebRTC server-side processing (rejected: unnecessary complexity and latency), CSS-only overlay export (rejected: cannot reliably export composed pixels).

## Decision 2: Backend storage for MVP uses local filesystem with static URL serving
- Decision: Store final composed images on server local disk and expose downloadable URLs through REST response.
- Rationale: Fastest path for MVP, minimal infra dependency, sufficient for single venue deployment pilot.
- Alternatives considered: DB BLOB storage (rejected: operational overhead), immediate S3 integration (rejected for MVP scope but reserved for next phase).

## Decision 3: API boundary keeps composition in browser and uploads final image only
- Decision: Compose frame + guest image in browser, upload one final image payload to backend.
- Rationale: Preserves responsive UX and reduces backend image-processing load; aligns with workflow requirement where browser already owns preview and overlay.
- Alternatives considered: Server-side composition with separate frame/photo uploads (rejected: increased round trips and processing time).

## Decision 4: QR generation occurs on frontend from backend-provided download URL
- Decision: Backend returns canonical image URL; frontend renders QR code immediately using URL.
- Rationale: Meets requirement for instant QR display and keeps backend stateless regarding QR assets.
- Alternatives considered: Backend-generated QR image (rejected: extra API and storage complexity).

## Decision 5: Session reset policy combines explicit completion and idle timeout
- Decision: Provide `Complete` button and 10-second idle auto-reset on delivery screen.
- Rationale: Ensures high-throughput guest turnover in public event flow while preserving user control.
- Alternatives considered: Manual reset only (rejected: queue stalls), auto-reset only (rejected: poor clarity for guests).

## Decision 6: Test strategy uses layered validation (unit + integration + E2E smoke)
- Decision: Frontend unit tests for flow/state, backend API integration tests for upload/url contract, and one end-to-end smoke flow on tablet viewport.
- Rationale: Balances confidence and speed for event-critical behavior.
- Alternatives considered: E2E-only strategy (rejected: brittle and slow), unit-only strategy (rejected: weak cross-layer assurance).
