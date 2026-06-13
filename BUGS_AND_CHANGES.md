# Bugs and Changes Log - SMG Employee Portal

This document tracks the widespread functional bugs discovered during UAT (User Acceptance Testing) and the corresponding fixes implemented to stabilize the portal architecture.

## Overview
During recent testing, team members reported that various "Approve/Reject" features, data saving operations, and functional portal views were unresponsive or failing silently. A deep dive into the codebase revealed that while the MongoDB schemas and frontend API hooks (`api.ts`) were designed, the corresponding backend Express routes in `apiRoutes.js` were never fully implemented.

---

## 1. Missing Backend API Endpoints (Functional Disconnect)

### Bug Discovered
The frontend service layer (`api.ts`) was attempting to fetch data and submit updates for over a dozen features, but the backend was returning `404 Not Found` because the endpoints did not exist. This affected almost all secondary modules.

### Fix Implemented
Injected over 120 lines of auto-generated generic routes into `backend/routes/apiRoutes.js` to connect the frontend to the existing Mongoose models. 
The following endpoints were fully implemented:
- **Attendance Miss Slips:** `GET /miss-slips/:userId`, `POST /miss-slips`, `GET /miss-slips-all`
- **Travel Requests:** `GET /travel/:userId`, `POST /travel`, `PUT /travel/:id`
- **MRF (Manpower Requisition):** `GET /mrf`, `POST /mrf`, `PUT /mrf/:id`
- **Interviews:** `GET /interviews`, `POST /interviews`, `PUT /interviews/:id`
- **Job Descriptions:** `GET /job-descriptions`, `POST /job-descriptions`
- **Key Representatives:** `GET /key-reps`, `POST /key-reps`
- **Welfare Programs:** `GET /welfare`, `POST /welfare`, `PUT /welfare/:id/enroll`
- **Resignations:** `GET /resignations/:userId`, `GET /resignations-all`, `POST /resignations`, `PUT /resignations/:id`

---

## 2. Global Approval Workflows Failing

### Bug Discovered
The "Approve" and "Reject" buttons across the HR Portal, Reception Portal, and Admin Dashboards were failing. The frontend called `/requests/:id/approve` and `/requests/:id/reject`, but these specific action endpoints were missing. Additionally, when the frontend tried to send a standard `PUT` request with `{ status: 'Approved' }` to `/requests/:id`, it failed because the backend only checked the generic `Request` collection and ignored `Leave` and `GatePass` requests.

### Fix Implemented
- Added dedicated `/leaves/:id/approve` and `/leaves/:id/reject` endpoints with automated notification triggers.
- Added `/gatepasses/:id/approve`, `/gatepasses/:id/reject`, and `/gatepasses/:id/cancel` endpoints with email & notification triggers.
- Added dynamic `/requests/:id/approve` and `/requests/:id/reject` endpoints. These routes now intelligently search across `Leave`, `GatePass`, and `Request` collections simultaneously, meaning the unified HR dashboard can approve any request type without crashing.

---

## 3. Department Data Store Persistence

### Bug Discovered
Portals using `getDeptStore` and `saveDeptStore` (e.g., Policies, Notifications, Welfare, Uniform Portal) were failing to save data because the backend `/dept-store/:key` route was missing, despite the `DepartmentData` model existing.

### Fix Implemented
Created the dynamic `/dept-store/:key` endpoints (`GET`, `PUT`, `DELETE`). This replaces the legacy `localStorage` fallback with robust MongoDB persistence, ensuring data syncs across all devices and users viewing the department portals.

---

## 4. Insecure Canteen Portal Fetch Architecture

### Bug Discovered
The `CanteenPortal.tsx` was still utilizing legacy, manual `fetch('http://localhost:5000/api/...')` calls instead of utilizing the centralized `apiFetch` service layer. This bypassed the JWT authentication headers, risking CORS issues and unauthorized access errors.

### Fix Implemented
Refactored `CanteenPortal.tsx`:
- Replaced all manual `fetch` operations with `apiFetch`.
- Cleaned up the `useDataStore` hook inside the Canteen Portal to utilize the centralized API configuration.
- Added missing `useMemo` imports to prevent React compilation warnings.

---

## Conclusion
The portal is now structurally sound. All frontend actions now properly map to a functioning backend route, ensuring that real-time features, data synchronization, and approval logic operate exactly as intended for upcoming deployment and review meetings.
