# AI Context - SMG Employee Management Portal

## Objective
This document outlines the changes made to the SMG Employee Management Portal in the recent sessions to eliminate mock data, integrate all 12 departmental dashboards with the MongoDB backend, and implement an automated global and service-specific notification system.

## Key Technical Implementations

### 1. Centralized Data Store Migration (Replacing Mock localStorage)
*   **Problem:** The 12 department portals (Events, HR, Finance, Assembly, etc.) were initially designed using hardcoded arrays and `localStorage`.
*   **Solution:** Created a dynamic `useDataStore` hook and generic backend endpoints (`GET /dept-store/:key` and `PUT /dept-store/:key`).
*   **Result:** Data from portals is now persistently saved in MongoDB under the `DepartmentData` schema.

### 2. Global Notification Broadcaster
*   **Trigger:** Built directly into the `PUT /dept-store/:key` endpoint and `POST /notifications/global`.
*   **Action:** When a portal creates new data (e.g., adding an event), the system automatically iterates over all active `Users` and inserts a `Notification` document for each user.
*   **UI Impact:** Employees instantly see a red dot on their bell icon and can view the notification detailing what was updated (e.g., "New production order PO001...").

### 3. Department Service & Notification Endpoints (PUT Requests)
*   Added comprehensive `PUT` endpoints in `backend/routes/apiRoutes.js` for various services to handle status approvals/rejections by department admins.
*   **Integrated Services:**
    *   `PUT /leaves/:id`
    *   `PUT /gatepasses/:id`
    *   `PUT /transport/:id`
    *   `PUT /guesthouse/:id`
    *   `PUT /asset-requests/:id`
    *   `PUT /sim/:id`
    *   `PUT /uniforms/:id`
    *   `PUT /canteen/orders/:id`
    *   `PUT /requests/:id` (General)
*   **Action:** When an admin approves or rejects a request, a targeted notification is created *only* for the `User` who made the request, confirming the new status.

### 4. Salary Generation Notification
*   Added `POST /payroll` endpoint to handle salary generation.
*   **Action:** When HR/Finance creates a payroll entry for a user, a success notification ("Salary Credited") is generated specifying the net amount and month.

### 5. Super Admin - System Health Dashboard
*   Modified `GET /admin/dashboard` to return a `systemHealth` object.
*   Checks `mongoose.connection.readyState` for DB status.
*   Checks `process.env.SMTP_USER` for Email service configuration.
*   Updated `SuperAdminDashboard.tsx` to render these vital signs via color-coded indicators.

### 6. Email Delivery Configuration
*   Verified `.env` variables `SMTP_USER` and `SMTP_PASS`.
*   Confirmed usage of `nodemailer` for transactional emails (like user onboarding credentials).
*   **Important Caveat for Future Use:** If Gmail SMTP fails with `535 5.7.8`, the provided standard password must be replaced with a 16-character Google App Password (2FA must be enabled on the account).

## Files Modified Heavily
1.  `backend/routes/apiRoutes.js` (Added all PUT hooks, `/payroll`, `/notifications/global`)
2.  `frontend/src/services/api.ts` (Added bindings like `createPayroll`, `triggerGlobalNotification`)
3.  `frontend/src/pages/superadmin/SuperAdminDashboard.tsx` (Added System Health UI)
4.  `frontend/src/pages/departments/HrPortal.tsx` (Migrated to live data from mock)
5.  `frontend/src/pages/departments/AssemblyPortal.tsx` (Injected explicit notification triggers)
6.  `fix_mock.js` (Script used to auto-patch all portals' data hooks)

## Recent Session Accomplishments & Enhancements

### 1. Reception Dialog Spacing & Input Overlap Fixes
*   Adjusted `frontend/src/components/ui/label.tsx` using `mb-1.5` and `leading-normal` to completely resolve horizontal overlap between labels and text boxes.
*   Enlarged vertical dialog spacing inside all reception forms (e.g. New Visitor, Corporate Guest, Interview Candidate, Government Official, Add Key Person) by moving from `space-y-4` and `gap-4` to `space-y-5` and `gap-x-6 gap-y-5`.

### 2. Search Bar Layout & Width Refinements
*   Set search bar header container to use `flex-col md:flex-row md:items-center` so that layout elements stack elegantly on smaller viewports.
*   Resized the search input to a compact `w-72` width to match the original frontend specs.

### 3. HR Automated Email Alerts (`tuskydv@gmail.com`)
*   Integrated automated trigger notification emails in `backend/routes/apiRoutes.js` under the PUT store routes.
*   Whenever a new interview candidate is registered under `reception:interviewCandidates` or a visitor of type `candidate` checks in under `reception:visitors`, Nodemailer dispatches a clean HTML brief to **`tuskydv@gmail.com`**.
*   Patched the `sendEmail` positional arguments mismatch in the existing gate pass approval notification.

### 4. Workflows Documentation
*   Created a centralized documentation folder [**`READMEPORTALSFLOW`**](file:///d:/JUNEINTERN/READMEPORTALSFLOW/README.md) explaining credentials, flow charts, and specific workflows for each portal subsystem.

## Current Application Status
The application is fully optimized, responsive, and compile-checked (successful `npm run build` validation). All requested features—from backend email hooks to layout spacing—are in place.
