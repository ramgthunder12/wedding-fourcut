# Implementation Plan: Wedding Four Cut Web Photo Booth

**Branch**: `001-wedding-photo-booth` | **Date**: 2026-03-13 | **Spec**: `/specs/001-wedding-photo-booth/spec.md`
**Input**: Feature specification from `/specs/001-wedding-photo-booth/spec.md`

## Summary

태블릿/iPad 브라우저에서 동작하는 웨딩 포토부스 웹앱을 구축한다. 프론트엔드는 React로 프레임 선택, 카메라 미리보기(getUserMedia), 오버레이 합성(canvas), 촬영 및 QR 표시를 담당한다. 백엔드는 Spring Boot REST API로 이미지 업로드/저장과 다운로드 URL 제공을 담당하며, MVP 단계에서는 로컬 파일 저장소를 사용한다.

## Technical Context

**Language/Version**: TypeScript (React 18), Java 21 (Spring Boot 3.x)  
**Primary Dependencies**: React, Vite, Canvas API, MediaDevices/getUserMedia, qrcode (frontend), Spring Boot Web, Spring Boot Validation (backend)  
**Storage**: Backend local filesystem storage for MVP (`/uploads`), metadata in memory for MVP  
**Testing**: Frontend: Vitest + React Testing Library; Backend: JUnit 5 + MockMvc; E2E smoke: Playwright  
**Target Platform**: Modern tablet and iPad browsers (Safari iPadOS, Chrome/Edge Android tablet)
**Project Type**: Web application (`frontend` + `backend`)  
**Performance Goals**: Camera preview perceived as smooth (target 24+ FPS on venue tablets), image compose+upload <= 3s p95, QR rendering <= 500ms after URL response  
**Constraints**: Minimal-touch UX (guest flow <= 3 taps), continuous event usage, no native app install, camera permission denial recovery path required  
**Scale/Scope**: Single active event session per device, tens to low hundreds of guest captures per event

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

현재 `.specify/memory/constitution.md`가 템플릿 플레이스홀더 상태여서 강제 가능한 구체 규칙이 존재하지 않는다. 본 계획에서는 기본 품질 게이트를 적용해 대체 검증한다.

- Gate A - Quality: 린트/포맷/정적검사 단계를 CI에 포함하도록 계획함. PASS
- Gate B - Testing: 단위/통합/E2E 스모크 테스트 전략을 명시함. PASS
- Gate C - UX Simplicity: 게스트 핵심 플로우 3탭 이내 목표 및 리셋 플로우 반영. PASS
- Gate D - Performance: 미리보기/합성/QR 시간 예산을 명시함. PASS

Post-Design Re-check (Phase 1 완료 후):

- 데이터 모델이 단일 세션/프레임/캡처/결과물 경계에 맞게 단순 유지됨. PASS
- API 계약이 게스트 플로우와 일치하며 불필요한 추상화 없음. PASS
- quickstart의 검증 시나리오가 성능/리셋 요구를 포함함. PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-wedding-photo-booth/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── wedding-four-cut-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/main/java/com/weddingfourcut/
│   ├── api/
│   ├── service/
│   ├── model/
│   └── config/
└── src/test/java/com/weddingfourcut/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── features/capture/
│   ├── features/frame-setup/
│   ├── services/
│   └── utils/
└── tests/
```

**Structure Decision**: 웹앱 특성에 맞춰 `frontend`/`backend` 분리 구조를 채택한다. 카메라/캔버스 로직은 프론트엔드 feature 모듈로 분리하고, 이미지 저장 및 URL 발급은 백엔드 API 계층으로 집중한다.

## Complexity Tracking

해당 없음. 현재 범위는 MVP 중심 단순 구성(로컬 저장소, 단일 세션, REST 2~4개 핵심 엔드포인트)으로 유지한다.
