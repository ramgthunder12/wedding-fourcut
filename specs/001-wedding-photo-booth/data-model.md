# Data Model: Wedding Four Cut

## 1. WeddingSession
- Purpose: 행사 단위 포토부스 세션의 루트 컨텍스트
- Fields:
  - `sessionId` (string, UUID, required)
  - `nickname` (string, 2-30 chars, required)
  - `status` (enum: `SETUP`, `READY`, `ACTIVE`, `ARCHIVED`)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)
- Relationships:
  - One-to-many with `FrameTemplate`
  - One-to-many with `GuestCapture`
- Validation rules:
  - Nickname must be non-empty and trimmed
  - Session becomes `READY` only if at least one frame exists
- State transitions:
  - `SETUP` -> `READY` when first frame created
  - `READY` -> `ACTIVE` when guest capture starts
  - `ACTIVE` -> `READY` when guest flow reset completes
  - Any -> `ARCHIVED` when event ends

## 2. FrameTemplate
- Purpose: 커플 사진 기반 오버레이 프레임 정의
- Fields:
  - `frameId` (string, UUID, required)
  - `sessionId` (string, FK to WeddingSession, required)
  - `name` (string, 1-40 chars, required)
  - `overlayImagePath` (string, required)
  - `thumbnailPath` (string, optional)
  - `isActive` (boolean, default true)
  - `createdAt` (datetime, required)
- Relationships:
  - Many-to-one with `WeddingSession`
  - Referenced by `GuestCapture.selectedFrameId`
- Validation rules:
  - Overlay image file type must be png/jpg/webp
  - Frame cannot be selectable when `isActive=false`

## 3. GuestCapture
- Purpose: 게스트 1회 촬영 트랜잭션 추적
- Fields:
  - `captureId` (string, UUID, required)
  - `sessionId` (string, FK, required)
  - `selectedFrameId` (string, FK, required)
  - `status` (enum: `PREVIEW`, `CAPTURED`, `UPLOADING`, `DELIVERED`, `FAILED`)
  - `capturedAt` (datetime, optional)
  - `completedAt` (datetime, optional)
  - `failureReason` (string, optional)
- Relationships:
  - Many-to-one with `WeddingSession`
  - One-to-one with `ComposedPhoto`
- Validation rules:
  - Capture cannot transition to `DELIVERED` without linked `ComposedPhoto`
- State transitions:
  - `PREVIEW` -> `CAPTURED` on shutter click
  - `CAPTURED` -> `UPLOADING` when upload starts
  - `UPLOADING` -> `DELIVERED` on successful response
  - `UPLOADING` -> `FAILED` on error

## 4. ComposedPhoto
- Purpose: 프레임 합성 결과물 및 다운로드 원본
- Fields:
  - `photoId` (string, UUID, required)
  - `captureId` (string, FK, required)
  - `sessionId` (string, FK, required)
  - `filePath` (string, required)
  - `publicUrl` (string, required)
  - `mimeType` (string, required)
  - `sizeBytes` (number, required)
  - `createdAt` (datetime, required)
- Relationships:
  - One-to-one with `GuestCapture`
  - One-to-one with `DeliveryQR`
- Validation rules:
  - `publicUrl` must be absolute URL in API response contract
  - file size upper bound enforced by backend upload limit

## 5. DeliveryQR
- Purpose: 게스트 다운로드 전달용 QR 표현 객체
- Fields:
  - `qrId` (string, UUID, required)
  - `photoId` (string, FK, required)
  - `targetUrl` (string, required)
  - `generatedAt` (datetime, required)
- Relationships:
  - One-to-one with `ComposedPhoto`
- Validation rules:
  - `targetUrl` must match `ComposedPhoto.publicUrl`
