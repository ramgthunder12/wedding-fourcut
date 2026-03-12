# Quickstart: Wedding Four Cut MVP

## Prerequisites
- Node.js 20+
- Java 21
- Gradle or Maven wrapper (project default)
- Tablet/iPad and desktop on same network for validation

## 1. Start Backend
```bash
cd backend
./mvnw spring-boot:run
```
Expected:
- API starts on `http://localhost:8080`
- Static image serving path is enabled for uploaded files

## 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Expected:
- App starts on `http://localhost:5173`
- Frontend points to backend base URL `http://localhost:8080`

## 3. Couple Setup Flow Validation
1. Open app on tablet browser.
2. Enter nickname and create session.
3. Upload at least one couple photo and generate one or more frames.
4. Verify frame selection screen shows generated frames.

## 4. Guest Capture Flow Validation
1. Select a frame.
2. Allow camera permission.
3. Verify live preview with frame overlay appears.
4. Tap capture once and verify processing indicator.

## 5. Delivery and Reset Validation
1. Verify QR code appears within performance target after capture.
2. Scan QR from phone and download image.
3. Tap `Complete` and verify immediate reset to frame selection.
4. Repeat capture and leave idle on QR screen; verify auto-reset at 10 seconds.

## 6. Test Commands
### Frontend
```bash
cd frontend
npm run test
```

### Backend
```bash
cd backend
./mvnw test
```

### E2E Smoke
```bash
# Example: run Playwright scenario for frame-select -> capture -> QR -> reset
cd frontend
npm run test:e2e
```

## 7. Performance Acceptance Checks
- Camera preview appears responsive (no visible stutter) on target tablet.
- Capture click to QR render <= 3 seconds p95 during repeated trials.
- Complete/reset response <= 1 second.

## 8. Operator Runbook (Event Day)
1. Prepare one tablet in landscape orientation and keep charger connected.
2. Open the app and complete couple setup before guests arrive.
3. Verify at least one frame appears on the frame selection screen.
4. Run one trial capture and scan QR from a phone.
5. Keep browser tab pinned and disable auto-sleep if possible.
6. If camera permission is lost, reload page and re-allow camera access.
7. If upload fails repeatedly, verify backend is reachable on local network.
