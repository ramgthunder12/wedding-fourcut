# Feature Specification: Wedding Four Cut Web Photo Booth

**Feature Branch**: `001-wedding-photo-booth`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: User description: "Wedding Four Cut web app for tablet-based wedding photo booth experience."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Couple Setup and Frame Creation (Priority: P1)

신랑신부는 웨딩 전에 닉네임으로 세션을 만들고, 본인 사진을 업로드해 게스트용 커스텀 프레임을 생성한다.

**Why this priority**: 프레임이 준비되지 않으면 게스트 촬영 단계가 시작될 수 없기 때문이다.

**Independent Test**: 세션 생성 후 사진 업로드로 프레임 1개 이상 생성, 프레임 선택 화면에 노출되면 검증된다.

**Acceptance Scenarios**:

1. **Given** 앱 첫 화면, **When** 커플이 닉네임을 입력하고 세션 생성 버튼을 누르면, **Then** 세션이 생성되고 프레임 업로드 단계로 이동한다.
2. **Given** 세션이 생성된 상태, **When** 커플이 이미지를 업로드해 프레임 생성을 완료하면, **Then** 프레임이 저장되고 게스트 선택 목록에서 보인다.

---

### User Story 2 - Guest Capture with Live Overlay (Priority: P2)

게스트는 태블릿에서 프레임을 고르고 카메라 미리보기 위 오버레이를 확인하며 촬영한다.

**Why this priority**: 행사 현장에서 직접 체감되는 핵심 경험이기 때문이다.

**Independent Test**: 프레임 1개가 있는 상태에서 선택 -> 미리보기 -> 촬영까지 완료되면 검증된다.

**Acceptance Scenarios**:

1. **Given** 프레임 선택 화면, **When** 게스트가 프레임을 선택하면, **Then** 카메라가 켜지고 선택 프레임 오버레이가 미리보기에 표시된다.
2. **Given** 미리보기가 표시된 상태, **When** 게스트가 촬영 버튼을 누르면, **Then** 프레임이 반영된 촬영 결과 생성 프로세스가 시작된다.

---

### User Story 3 - Photo Delivery and Session Reset (Priority: P3)

촬영 후 최종 이미지가 저장되고 QR 코드가 표시되며, 완료 버튼 또는 유휴 타임아웃으로 다음 게스트를 위해 리셋된다.

**Why this priority**: 연속 사용 이벤트에서 회전율과 단순 사용성을 보장하기 위해 필요하다.

**Independent Test**: 한 번의 촬영 후 QR 스캔 다운로드와 완료 버튼 리셋, 그리고 10초 유휴 자동 리셋이 작동하면 검증된다.

**Acceptance Scenarios**:

1. **Given** 촬영 완료 직후, **When** 시스템이 이미지 저장을 성공하면, **Then** 다운로드 링크 기반 QR 코드가 즉시 표시된다.
2. **Given** QR 화면, **When** 게스트가 완료 버튼을 누르면, **Then** 화면이 프레임 선택 상태로 초기화된다.
3. **Given** QR 화면에서 입력 없음, **When** 10초가 경과하면, **Then** 시스템이 자동으로 프레임 선택 화면으로 복귀한다.

### Edge Cases

- 카메라 권한 거부 시 촬영을 막고 권한 허용 안내를 명확히 보여준다.
- 프레임이 없는 상태에서 게스트가 촬영을 시도하면 설정 단계로 유도한다.
- 이미지 업로드/저장 실패 시 QR 표시 대신 재시도 경로를 제공한다.
- QR 화면에서 다중 터치/연타가 발생해도 중복 저장이나 중복 완료 처리를 방지한다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 커플 닉네임으로 웨딩 세션을 생성해야 한다.
- **FR-002**: 시스템은 커플 이미지 업로드를 받아 프레임을 1개 이상 생성해야 한다.
- **FR-003**: 시스템은 생성된 프레임 목록을 게스트에게 선택 가능하게 표시해야 한다.
- **FR-004**: 시스템은 선택 프레임 오버레이를 카메라 미리보기 위에 표시해야 한다.
- **FR-005**: 시스템은 촬영 이미지를 선택 프레임과 합성해 최종 이미지를 생성해야 한다.
- **FR-006**: 시스템은 최종 이미지를 서버에 저장하고 접근 가능한 이미지 URL을 반환해야 한다.
- **FR-007**: 시스템은 반환된 이미지 URL로 QR 코드를 생성/표시해야 한다.
- **FR-008**: 시스템은 완료 버튼 선택 시 게스트 플로우를 종료하고 프레임 선택 화면으로 초기화해야 한다.
- **FR-009**: 시스템은 QR 화면 유휴 10초 후 자동 초기화를 수행해야 한다.
- **FR-010**: 시스템은 태블릿/iPad 터치 환경에서 최소 단계로 조작 가능해야 한다.

### Key Entities *(include if feature involves data)*

- **Wedding Session**: 행사 단위 운영 세션. 닉네임, 상태, 프레임 목록을 가진다.
- **Frame Template**: 커플 이미지 기반 오버레이 프레임 자산.
- **Guest Capture**: 게스트 촬영 1회 처리 단위.
- **Composed Photo**: 합성 완료 후 저장된 최종 이미지와 URL.
- **Delivery QR**: 최종 이미지 URL을 인코딩한 QR 표현 객체.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 첫 방문 게스트의 95% 이상이 안내 없이 촬영 시작까지 완료한다.
- **SC-002**: 프레임 선택 후 카메라 미리보기 시작이 2초 이내(p95)다.
- **SC-003**: 촬영 클릭 후 QR 표시까지 3초 이내(p95)다.
- **SC-004**: 완료 버튼 또는 자동 리셋 후 1초 이내 프레임 선택 화면 복귀를 달성한다.
