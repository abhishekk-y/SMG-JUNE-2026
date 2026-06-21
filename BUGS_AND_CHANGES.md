# Bugs and Changes Log - SMG Employee Portal

This document tracks all functional bugs discovered during code audits and UAT, along with the corresponding fixes.

---

## June 2026 Static Code Audit — 27 Bugs Found & Fixed

Full static code review identified 27 bugs across backend routes, models, frontend context, pages, and login flow.
Each bug is fixed individually with a dedicated git commit.

---

### BUG-001 — Duplicate Mongoose Index on `DepartmentData.storeKey`
**File:** `backend/models/DepartmentData.js:6`
**Root Cause:** `storeKey` had `index: true` inline AND a separate `schema.index({ storeKey:1 }, { unique:true })`. Double-declaration caused a Mongoose warning on every server boot; inline index did NOT enforce uniqueness.
**Fix:** Removed `index: true` from the field. Uniqueness enforced by `schema.index()` only.
**Commit:** `fix(BUG-001): remove duplicate storeKey index in DepartmentData model`
**Status:** FIXED

---

### BUG-002 — ~110 Lines of Duplicate Routes (Dead Code)
**File:** `backend/routes/apiRoutes.js:1519-1629`
**Root Cause:** 8 route groups (miss-slips, travel, MRF, interviews, job-descriptions, key-reps, welfare, resignations) defined twice. Express uses first match; second block was dead code with inconsistent `.populate()` / `sort()` logic.
**Fix:** Deleted entire duplicate block at the bottom.
**Commit:** `fix(BUG-002): remove 110-line duplicate route block (dead code)`
**Status:** FIXED

---

### BUG-003 — Duplicate `/dashboard/:userId` Route Handler
**File:** `backend/routes/apiRoutes.js:822-839`
**Root Cause:** Two `GET /dashboard/:userId` handlers. First (line 329) runs; second was unreachable and returned a different response shape causing confusion.
**Fix:** Removed duplicate; left comment pointing to the real handler.
**Commit:** `fix(BUG-003): remove duplicate /dashboard/:userId route handler`
**Status:** FIXED

---

### BUG-004 — Notification `category` Value `'Requests'` Not in Enum
**File:** `backend/routes/apiRoutes.js:814`
**Root Cause:** `Notification.create({ category: 'Requests' })` — schema enum has `'Request'` (singular). Mongoose silently used default `'Other'`.
**Fix:** Changed `'Requests'` to `'Request'`.
**Commit:** `fix(BUG-004): correct Notification category enum value Requests to Request`
**Status:** FIXED

---

### BUG-005 — Login Stores JWT Under Wrong localStorage Key (Auth Completely Broken)
**File:** `frontend/src/components/Login.tsx:31-34`
**Root Cause:** Login stored token as `localStorage.setItem('token', data.token)`. But `apiFetch()` in `api.ts` reads `localStorage.getItem('employee_user')` and parses `.token`. Key `'employee_user'` was never written, so every API call sent no token — all requests were unauthenticated.
**Fix:** Added `localStorage.setItem('employee_user', JSON.stringify(data))` on login success.
**Commit:** `fix(BUG-005): write employee_user key to localStorage on login so api.ts auth works`
**Status:** FIXED

---

### BUG-006 — AppContextEnhanced `fetchSafe` Uses Raw fetch (No Auth)
**File:** `frontend/src/context/AppContextEnhanced.tsx:125`
**Root Cause:** `const fetchSafe = async (url) => { const r = await fetch(url) ... }` — unauthenticated.
**Fix:** Replaced raw unauthenticated fetch with `api.apiFetch` that handles bearer token header authentication.
**Commit:** `fix(BUG-006): use apiFetch for initial data fetching in AppContextEnhanced`
**Status:** FIXED

---

### BUG-007 — `activeEmployees` Queried by Non-Existent `status` Field
**File:** `backend/routes/apiRoutes.js:847`
**Root Cause:** `User.countDocuments({ status: { $ne: 'Inactive' } })` — User schema uses `isActive: Boolean`, no `status` field. Query always returned all users, making `activeEmployees === totalEmployees`.
**Fix:** Changed to `User.countDocuments({ isActive: true })`.
**Commit:** `fix(BUG-007): fix activeEmployees admin dashboard query to use isActive field`
**Status:** FIXED

---

### BUG-008 — LeavesPage Uses Raw fetch Without JWT Headers
**File:** `frontend/src/pages/LeavesPage.tsx:20-30,67-94`
**Root Cause:** Raw `fetch('http://localhost:5000/api/...')` calls bypass the `api.ts` JWT auth layer.
**Fix:** Replaced with `apiFetch` calls to pass user token.
**Commit:** `fix(BUG-008): replace raw fetch in LeavesPage with authenticated apiFetch`
**Status:** FIXED

---

### BUG-009 — AdminDashboard Uses Raw fetch Without JWT Headers
**File:** `frontend/src/pages/admin/AdminDashboard.tsx:67`
**Root Cause:** `fetch('http://localhost:5000/api/admin/dashboard')` with no JWT.
**Fix:** Replaced with `apiFetch('/admin/dashboard')` call.
**Commit:** `fix(BUG-009): fetch admin dashboard stats using authenticated apiFetch`
**Status:** FIXED

---

### BUG-010 — Clock-Out Hours Worked Uses Math.random()
**File:** `frontend/src/context/AppContextEnhanced.tsx:491-493`
**Root Cause:** `const hours = 9; const minutes = Math.floor(Math.random() * 60)` — fake random attendance data on every clock-out, never reflecting real time.
**Fix:** Replaced with actual calculation: parse clockInTime, diff against current time.
**Commit:** `fix(BUG-010): calculate real hours worked on clock-out instead of Math.random()`
**Status:** FIXED

---

### BUG-011 — Dead Code: `router.stack.find()` Non-Standard Express Hack
**File:** `backend/routes/apiRoutes.js:1291`
**Root Cause:** `const originalLeavesPost = router.stack.find(...)` — result never used, non-standard usage of Express internals, can break across Express versions.
**Fix:** Deleted the line.
**Commit:** `fix(BUG-011): remove unused router.stack.find dead code`
**Status:** FIXED

---

### BUG-012 — Gate Pass Cancel Sets `status = 'Rejected'` Instead of `'Cancelled'`
**File:** `backend/routes/apiRoutes.js:1420`
**Root Cause:** Employee self-cancelling a gate pass set `gp.status = 'Rejected'`, conflating "employee cancelled" with "admin rejected". Confused approval history.
**Fix:** Changed to `gp.status = 'Cancelled'`. Added 'Cancelled' to the GatePass status enum.
**Commit:** `fix(BUG-012): gate pass self-cancel sets Cancelled not Rejected`
**Status:** FIXED

---

### BUG-013 — SuperAdminRequestsPage Shows Hardcoded Mock Data
**File:** `frontend/src/pages/superadmin/SuperAdminRequestsPage.tsx`
**Root Cause:** 4 hardcoded mock requests. `getAllRequests()` from `api.ts` never called.
**Fix:** Replaced mock requests with live `apiFetch` call fetching actual requests from MongoDB.
**Commit:** `fix(BUG-013): connect SuperAdminRequestsPage to live requests API`
**Status:** FIXED

---

### BUG-014 — SuperAdminAnalyticsPage Shows Hardcoded Fake Statistics
**File:** `frontend/src/pages/superadmin/SuperAdminAnalyticsPage.tsx`
**Root Cause:** Hardcoded values (96.2%, 12,487 etc). `getCrossPortalStats()` from `api.ts` never called.
**Fix:** Replaced mock metrics with dynamic data fetched from the cross-portal stats API.
**Commit:** `fix(BUG-014): display live cross-portal stats in SuperAdminAnalyticsPage`
**Status:** FIXED

---

### BUG-015 — SuperAdminNotificationsPage Send Button Has No Handler
**File:** `frontend/src/pages/superadmin/SuperAdminNotificationsPage.tsx:29`
**Root Cause:** Send button has no `onClick`, form inputs have no state. Broadcast API didn't exist.
**Fix:** Implemented broadcast endpoint `POST /notifications/broadcast` on the backend, and hooked up controlled inputs + dynamic department selector on the frontend to call this endpoint on submit.
**Commit:** `fix(BUG-015): implement Super Admin Notification broadcasting`
**Status:** FIXED

---

### BUG-016 — Dashboard & Profile Always Show Hardcoded Mock User
**File:** `frontend/src/App.tsx:372,374`
**Root Cause:** `<DashboardPage userData={INITIAL_DATA.user} />` and `<ProfilePage userData={INITIAL_DATA.user} />` — mock "Rohit Sharma" passed regardless of who logged in.
**Fix:** Changed to `userData={currentUser}` from `useApp()` context.
**Commit:** `fix(BUG-016): pass live currentUser to DashboardPage and ProfilePage instead of mock`
**Status:** FIXED

---

### BUG-017 — Logout Does Not Clear `employee_user` from localStorage
**File:** `frontend/src/App.tsx:335-339`
**Root Cause:** Logout cleared `'token'`, `'userId'`, `'userData'` but not `'employee_user'`. After BUG-005 fix, this key is now written on login and must be cleared on logout.
**Fix:** Added `localStorage.removeItem('employee_user')` to logout handler.
**Commit:** `fix(BUG-017): clear employee_user from localStorage on logout`
**Status:** FIXED

---

### BUG-018 — Gate Pass Missing from Employee Sidebar Navigation
**File:** `frontend/src/App.tsx:511-519`
**Root Cause:** GatePassPage and all backend routes existed but the page was unreachable — no sidebar entry.
**Fix:** Added `{ id: 'gate-pass', icon: Shield, label: 'Gate Pass' }` to attendance sidebar dropdown.
**Commit:** `fix(BUG-018): add Gate Pass entry to employee sidebar navigation`
**Status:** FIXED

---

### BUG-019 — Notification `category: 'Account'` Not in Schema Enum (x2)
**File:** `backend/routes/apiRoutes.js:235,315`
**Root Cause:** Welcome and password-change notifications used `category: 'Account'` — not in Notification enum. Mongoose defaulted to `'Other'`.
**Fix:** Changed both to `category: 'System'`.
**Commit:** `fix(BUG-019): correct Notification category Account to System for system events`
**Status:** FIXED

---

### BUG-020 — Notifications Never Show as Read (`n.read` vs `n.isRead`)
**File:** `frontend/src/context/AppContextEnhanced.tsx:178`
**Root Cause:** `isRead: n.read` but the Notification schema field is `isRead`. So `n.read` was always `undefined` — all notifications always appeared unread.
**Fix:** Changed to `isRead: n.isRead`.
**Commit:** `fix(BUG-020): fix notification read field from n.read to n.isRead`
**Status:** FIXED

---

### BUG-021 — Leave Balance Always Shows Defaults Due to Wrong Field Names
**File:** `frontend/src/context/AppContextEnhanced.tsx:151-155`
**Root Cause:** Code read `lvBal.casual`, `lvBal.sick` etc but `LeaveBalance` schema uses `casualTotal`, `casualUsed`, `sickTotal`, `sickUsed`, `annualTotal`, `annualUsed`. All reads returned `undefined`.
**Fix:** Corrected all field names to match actual schema.
**Commit:** `fix(BUG-021): fix leave balance field names to match LeaveBalance DB schema`
**Status:** FIXED

---

### BUG-022 — HR Notification Email Hardcoded to Personal Gmail Address
**File:** `backend/routes/apiRoutes.js:1211,1239`
**Root Cause:** `sendEmail('tuskydv@gmail.com', ...)` hardcoded for interview candidate and visitor check-in alerts.
**Fix:** Changed to `process.env.HR_EMAIL || 'hr@smg.com'`. Add `HR_EMAIL` to `.env`.
**Commit:** `fix(BUG-022): replace hardcoded HR email with HR_EMAIL env variable`
**Status:** FIXED

---

### BUG-023 — Report Download Buttons Non-Functional (Minor)
**File:** `frontend/src/pages/superadmin/SuperAdminReportsPage.tsx`
**Root Cause:** Hardcoded list of files with no action or backend generation route.
**Fix:** Added `generateReportPDF` endpoint `/pdf/report/:reportId` in backend using pdfkit and wired report list buttons to trigger browser PDF open/download.
**Commit:** `fix(BUG-023): implement Super Admin Report PDF download`
**Status:** FIXED

---

### BUG-024 — Settings Checkboxes Uncontrolled/No State (Minor)
**File:** `frontend/src/pages/superadmin/SuperAdminSettingsPage.tsx`
**Root Cause:** Checkboxes did not bind to React state or store/persist configurations in MongoDB.
**Fix:** Connected checkboxes to local state and integrated persistent load/save using the generic `/dept-store/system_settings` MongoDB data store.
**Commit:** `fix(BUG-024): connect settings checkboxes to state and database persistence`
**Status:** FIXED

---

### BUG-025 — Mobile Sidebar Missing Most Nav Items (Minor)
**File:** `frontend/src/App.tsx` (mobile sidebar section)
**Root Cause:** Mobile sidebar was hardcoded to only 4 navigation items regardless of user type.
**Fix:** Refactored sidebar elements to dynamically generate menu lists according to the logged-in role (employee, admin, superadmin).
**Commit:** `fix(BUG-025): dynamic mobile sidebar navigation based on userRole`
**Status:** FIXED

---

### BUG-026 — Topbar Search Bar Non-Functional (Minor)
**File:** `frontend/src/App.tsx` (Topbar component)
**Root Cause:** Input was completely uncontrolled and had no functional actions or results dropdown.
**Fix:** Implemented a smart global search overlay dropdown that dynamically matches matching portal pages relative to user's permissions, enabling instant quick-nav on enter/click.
**Commit:** `fix(BUG-026): connect Topbar search bar to dynamic page quick-navigation`
**Status:** FIXED

---

### BUG-027 — Department Card Border Color Is Invalid CSS
**File:** `frontend/src/pages/admin/AdminDashboard.tsx:285`
**Root Cause:** `dept.color.replace('bg-', '')` turns Tailwind class `bg-blue-500` into `blue-500` which is not a valid CSS color. Border renders with no colour.
**Fix:** Implemented color mapping lookup table to resolve Tailwind names to correct hex codes.
**Commit:** `fix(BUG-027): fix admin dashboard border colors for department cards`
**Status:** FIXED

---


---

### BUG-028 — Hardcoded PDF Download URLs Bypass API Base Configuration
**Files:** `frontend/src/pages/LeavesPage.tsx`, `frontend/src/pages/ProjectsPageEnhanced.tsx`, `frontend/src/pages/superadmin/SuperAdminReportsPage.tsx`, `frontend/src/pages/admin/AdminRequestsPage.tsx`
**Root Cause:** PDF downloads triggered via `window.open` hardcoded the `http://localhost:5000` base URL, bypassing the centralized configuration and causing failures in environments with different hosts.
**Fix:** Created and used `downloadPDF` from `api.ts` to dynamically resolve the API base URL.
**Commit:** Multiple commits migrating each page to the centralized `downloadPDF` helper.
**Status:** FIXED

---

### BUG-029 — Unauthenticated Raw fetch Calls & Unused API Base Constants
**Files:** `frontend/src/pages/GatePassPage.tsx`, `frontend/src/pages/admin/AdminRequestsPage.tsx`, `frontend/src/pages/superadmin/SuperAdminDashboard.tsx`, `frontend/src/pages/ProjectsPageEnhanced.tsx`, `frontend/src/pages/TransportPage.tsx`, `frontend/src/pages/CanteenPage.tsx`, `frontend/src/pages/GuestHousePage.tsx`, `frontend/src/pages/ProfilePage.tsx`
**Root Cause:** Legacy raw fetch calls bypassed authentication headers (JWT), and dead/unused `const API = 'http://localhost:5000/api'` declarations littered the departmental pages.
**Fix:** Migrated all remaining raw fetch calls to the centralized `apiFetch` and removed all unused `API` variables.
**Commit:** Multiple commits migrating and cleaning up departmental page fetches.
**Status:** FIXED

---

### BUG-030 — Login Component Hardcoded Endpoint Fetch
**File:** `frontend/src/components/Login.tsx:21`
**Root Cause:** The Login component executed a raw, manual fetch directly to `http://localhost:5000/api/login`, bypassing the unified API service configuration.
**Fix:** Refactored the login form submission to utilize the centralized `login` service from `src/services/api.ts`.
**Commit:** `fix(frontend): migrate Login component to centralized login API service`
**Status:** FIXED

## Earlier Fixes (Pre-Audit)

### 1 — Missing Backend API Endpoints
Added full CRUD for miss-slips, travel, MRF, interviews, job-descriptions, key-reps, welfare, resignations.

### 2 — Global Approval Workflows
Added dedicated approve/reject endpoints for leaves, gate passes, and general requests with notification + email triggers.

### 3 — Department Data Store Persistence
Created `/dept-store/:key` (GET/PUT/DELETE) replacing localStorage with MongoDB.

### 4 — Insecure Canteen Portal Fetch
Refactored `CanteenPortal.tsx` from raw `fetch()` to `apiFetch()` with JWT headers.
