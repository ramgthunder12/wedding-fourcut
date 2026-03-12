# Tasks: Wedding Four Cut Web Photo Booth

**Input**: Design documents from `/specs/001-wedding-photo-booth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature includes explicit testing expectations in spec/plan, so test tasks are included per story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app: `backend/src/`, `backend/src/test/`, `frontend/src/`, `frontend/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize frontend/backend projects and baseline tooling

- [X] T001 Initialize Spring Boot backend project skeleton in backend/pom.xml
- [X] T002 Initialize React + Vite frontend project skeleton in frontend/package.json
- [X] T003 [P] Configure frontend lint/test scripts in frontend/package.json
- [X] T004 [P] Configure backend test plugins and build profiles in backend/pom.xml
- [X] T005 [P] Add environment configuration templates in frontend/.env.example and backend/src/main/resources/application.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core platform elements required by all user stories

**?†Ô∏è CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Implement backend static upload serving config in backend/src/main/java/com/weddingfourcut/config/StaticResourceConfig.java
- [X] T007 [P] Implement shared API error model and exception handler in backend/src/main/java/com/weddingfourcut/api/ErrorHandler.java
- [X] T008 [P] Implement backend in-memory repositories for session/frame/capture in backend/src/main/java/com/weddingfourcut/service/InMemoryStore.java
- [X] T009 [P] Implement frontend API client base and typed contracts in frontend/src/services/apiClient.ts
- [X] T010 Implement frontend global app routing/state shell in frontend/src/pages/AppShell.tsx
- [X] T011 [P] Add frontend tablet viewport and touch UX baseline styles in frontend/src/styles/tablet.css
- [X] T012 [P] Add backend health and readiness endpoint in backend/src/main/java/com/weddingfourcut/api/HealthController.java

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Couple Setup and Frame Creation (Priority: P1) ?éØ MVP

**Goal**: Couple can create a wedding session and generate one or more selectable frames

**Independent Test**: Create session with nickname, upload couple image(s), and verify frame list is displayed for guest selection

### Tests for User Story 1

- [X] T013 [P] [US1] Add backend contract test for POST /api/sessions in backend/src/test/java/com/weddingfourcut/api/SessionControllerContractTest.java
- [X] T014 [P] [US1] Add frontend integration test for setup flow in frontend/tests/integration/coupleSetupFlow.test.tsx

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement WeddingSession and FrameTemplate domain models in backend/src/main/java/com/weddingfourcut/model/SessionModels.java
- [X] T016 [US1] Implement session creation endpoint in backend/src/main/java/com/weddingfourcut/api/SessionController.java
- [X] T017 [US1] Implement frame listing endpoint in backend/src/main/java/com/weddingfourcut/api/FrameController.java
- [X] T018 [P] [US1] Implement setup page with nickname input in frontend/src/features/frame-setup/SetupPage.tsx
- [X] T019 [P] [US1] Implement frame upload/preview UI in frontend/src/features/frame-setup/FrameUploadPanel.tsx
- [X] T020 [US1] Implement setup API service methods in frontend/src/services/sessionService.ts
- [X] T021 [US1] Wire setup completion to frame selection entry in frontend/src/pages/FrameSelectionPage.tsx

**Checkpoint**: User Story 1 is independently functional and testable

---

## Phase 4: User Story 2 - Guest Capture with Live Overlay (Priority: P2)

**Goal**: Guest can select a frame, view live camera overlay, and capture a composed photo input

**Independent Test**: From frame selection, enter camera preview with overlay and trigger capture action successfully

### Tests for User Story 2

- [X] T022 [P] [US2] Add frontend unit test for camera permission and stream state in frontend/tests/unit/cameraState.test.ts
- [X] T023 [P] [US2] Add frontend integration test for frame select to capture flow in frontend/tests/integration/guestCaptureFlow.test.tsx

### Implementation for User Story 2

- [X] T024 [P] [US2] Implement camera stream hook using getUserMedia in frontend/src/features/capture/useCameraStream.ts
- [X] T025 [P] [US2] Implement frame overlay preview component in frontend/src/features/capture/OverlayPreviewCanvas.tsx
- [X] T026 [US2] Implement capture page interaction flow in frontend/src/features/capture/CapturePage.tsx
- [X] T027 [US2] Implement image composition utility with canvas in frontend/src/utils/composeImage.ts
- [X] T028 [US2] Implement duplicate-tap guard and capture state transitions in frontend/src/features/capture/captureState.ts
- [X] T029 [US2] Integrate frame selection page to launch capture flow in frontend/src/pages/FrameSelectionPage.tsx

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - Photo Delivery and Session Reset (Priority: P3)

**Goal**: Save composed photo, show QR code, and reset quickly for the next guest

**Independent Test**: Capture result uploads, QR displays for download, then complete button and idle timeout reset to frame selection

### Tests for User Story 3

- [X] T030 [P] [US3] Add backend contract test for POST /api/captures response in backend/src/test/java/com/weddingfourcut/api/CaptureControllerContractTest.java
- [X] T031 [P] [US3] Add frontend integration test for QR and complete reset flow in frontend/tests/integration/photoDeliveryFlow.test.tsx
- [X] T032 [P] [US3] Add E2E smoke test for select-capture-deliver-reset on tablet viewport in frontend/tests/e2e/weddingBooth.smoke.spec.ts

### Implementation for User Story 3

- [X] T033 [P] [US3] Implement GuestCapture and ComposedPhoto models in backend/src/main/java/com/weddingfourcut/model/CaptureModels.java
- [X] T034 [US3] Implement capture upload endpoint and local file persistence in backend/src/main/java/com/weddingfourcut/api/CaptureController.java
- [X] T035 [US3] Implement photo metadata endpoint in backend/src/main/java/com/weddingfourcut/api/PhotoController.java
- [X] T036 [P] [US3] Implement frontend upload service and response mapping in frontend/src/services/captureService.ts
- [X] T037 [US3] Implement QR display component in frontend/src/features/capture/DeliveryQrPanel.tsx
- [X] T038 [US3] Implement complete button and 10-second idle auto-reset in frontend/src/features/capture/useSessionReset.ts
- [X] T039 [US3] Integrate delivery screen into capture flow in frontend/src/features/capture/CapturePage.tsx

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, performance, and operational readiness

- [X] T040 [P] Add performance instrumentation for preview FPS and capture-to-QR latency in frontend/src/utils/perfMetrics.ts
- [X] T041 Tune backend multipart limits and error messages in backend/src/main/resources/application.yml
- [X] T042 [P] Update operator runbook and usage instructions in specs/001-wedding-photo-booth/quickstart.md
- [X] T043 [P] Add accessibility/touch target refinements for tablet UI in frontend/src/styles/tablet.css
- [X] T044 Run full validation checklist and record outcomes in specs/001-wedding-photo-booth/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3-5)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on completion of all targeted user stories

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 and has no dependency on US2/US3
- **US2 (P2)**: Starts after Phase 2 and reuses frame/session outputs from US1 for full UX flow
- **US3 (P3)**: Starts after Phase 2; practically validated after US2 capture flow exists

### Within Each User Story

- Tests before implementation
- Models before service/controller logic
- Service/controller before UI integration
- Story-level checkpoint validation before next story

### Parallel Opportunities

- Setup: T003, T004, T005 can run in parallel after T001/T002
- Foundational: T007, T008, T009, T011, T012 can run in parallel
- US1: T013/T014 and T015/T018/T019 parallelizable by frontend/backend split
- US2: T022/T023 and T024/T025 can run in parallel
- US3: T030/T031/T032 and T033/T036 parallelizable
- Polish: T040/T042/T043 parallelizable

---

## Parallel Example: User Story 2

```bash
# Parallel test implementation:
Task: "T022 [US2] frontend camera state unit test"
Task: "T023 [US2] frontend capture flow integration test"

# Parallel core implementation:
Task: "T024 [US2] useCameraStream hook"
Task: "T025 [US2] OverlayPreviewCanvas component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational)
3. Complete Phase 3 (US1)
4. Validate setup-to-frame-list independently
5. Demo MVP for event preparation scenario

### Incremental Delivery

1. Deliver US1 (couple setup)
2. Deliver US2 (guest capture overlay)
3. Deliver US3 (delivery + reset)
4. Apply polish/performance tuning and rerun quickstart validation

### Parallel Team Strategy

1. Developer A: backend APIs and tests
2. Developer B: frontend setup/capture flow
3. Developer C: E2E/performance and polish tasks
4. Sync at phase checkpoints to avoid contract drift

---

## Notes

- [P] tasks are file-isolated and can be executed in parallel
- [USx] labels maintain traceability to user story scope
- Keep each user story independently runnable and testable
- Prefer small PRs grouped by phase checkpoints
