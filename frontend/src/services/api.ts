const API_BASE = 'http://localhost:5000/api';

// Generic fetch helper
async function apiFetch(endpoint: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'API Error');
    }
    return res.json();
}

// Auth
export const login = (email: string, password: string) =>
    apiFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });

// Users
export const getUsers = () => apiFetch('/users');
export const getUser = (id: string) => apiFetch(`/user/${id}`);
export const updateUser = (id: string, data: any) =>
    apiFetch(`/user/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// Attendance
export const getAttendance = (userId: string) => apiFetch(`/attendance/${userId}`);

// Leaves
export const getLeaves = (userId: string) => apiFetch(`/leaves/${userId}`);
export const applyLeave = (data: any) =>
    apiFetch('/leaves', { method: 'POST', body: JSON.stringify(data) });
export const getLeaveBalance = (userId: string) => apiFetch(`/leave-balance/${userId}`);
export const getAllLeaves = () => apiFetch('/leaves-all');

// Gate Pass
export const getGatePasses = (userId: string) => apiFetch(`/gatepasses/${userId}`);
export const createGatePass = (data: any) =>
    apiFetch('/gatepasses', { method: 'POST', body: JSON.stringify(data) });

// Payroll
export const getPayroll = (userId: string) => apiFetch(`/payroll/${userId}`);
export const getAllPayroll = () => apiFetch('/payroll-all');

// Training
export const getTrainings = () => apiFetch('/trainings');
export const enrollTraining = (id: string, userId: string) =>
    apiFetch(`/trainings/${id}/enroll`, { method: 'PUT', body: JSON.stringify({ userId }) });

// Documents
export const getDocuments = (userId: string) => apiFetch(`/documents/${userId}`);
export const createDocument = (data: any) =>
    apiFetch('/documents', { method: 'POST', body: JSON.stringify(data) });

// Projects
export const getProjects = () => apiFetch('/projects');
export const createProject = (data: any) =>
    apiFetch('/projects', { method: 'POST', body: JSON.stringify(data) });
export const updateProject = (id: string, data: any) =>
    apiFetch(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// Announcements
export const getAnnouncements = () => apiFetch('/announcements');
export const createAnnouncement = (data: any) =>
    apiFetch('/announcements', { method: 'POST', body: JSON.stringify(data) });

// Notifications
export const getNotifications = (userId: string) => apiFetch(`/notifications/${userId}`);
export const markNotificationRead = (id: string) =>
    apiFetch(`/notifications/${id}/read`, { method: 'PUT' });

// Departments
export const getDepartments = () => apiFetch('/departments');

// Canteen
export const getCanteenMenu = () => apiFetch('/canteen/menu');
export const placeCanteenOrder = (data: any) =>
    apiFetch('/canteen/orders', { method: 'POST', body: JSON.stringify(data) });

// Guest House
export const getGuestHouseBookings = (userId: string) => apiFetch(`/guesthouse/${userId}`);
export const bookGuestHouse = (data: any) =>
    apiFetch('/guesthouse', { method: 'POST', body: JSON.stringify(data) });

// Transport
export const getTransportRequests = (userId: string) => apiFetch(`/transport/${userId}`);
export const requestTransport = (data: any) =>
    apiFetch('/transport', { method: 'POST', body: JSON.stringify(data) });

// Uniform
export const requestUniform = (data: any) =>
    apiFetch('/uniforms', { method: 'POST', body: JSON.stringify(data) });

// SIM
export const requestSIM = (data: any) =>
    apiFetch('/sim', { method: 'POST', body: JSON.stringify(data) });

// Assets
export const getAssets = () => apiFetch('/assets');
export const requestAsset = (data: any) =>
    apiFetch('/asset-requests', { method: 'POST', body: JSON.stringify(data) });

// General Requests
export const getGeneralRequests = (userId: string) => apiFetch(`/general-requests/${userId}`);
export const submitGeneralRequest = (data: any) =>
    apiFetch('/general-requests', { method: 'POST', body: JSON.stringify(data) });

// Meetings
export const getMeetings = (userId: string) => apiFetch(`/meetings/${userId}`);

// Policies
export const getPolicies = () => apiFetch('/policies');

// Ideas
export const submitIdea = (data: any) =>
    apiFetch('/ideas', { method: 'POST', body: JSON.stringify(data) });

// Attendance Miss Slip
export const getMissSlips = (userId: string) => apiFetch(`/miss-slips/${userId}`);
export const createMissSlip = (data: any) =>
    apiFetch('/miss-slips', { method: 'POST', body: JSON.stringify(data) });

// Travel
export const getTravelRequests = (userId: string) => apiFetch(`/travel/${userId}`);
export const createTravelRequest = (data: any) =>
    apiFetch('/travel', { method: 'POST', body: JSON.stringify(data) });

// MRF
export const getMRFs = () => apiFetch('/mrf');
export const createMRF = (data: any) =>
    apiFetch('/mrf', { method: 'POST', body: JSON.stringify(data) });

// Interviews
export const getInterviews = () => apiFetch('/interviews');

// Job Descriptions
export const getJobDescriptions = () => apiFetch('/job-descriptions');

// Key Representatives
export const getKeyReps = () => apiFetch('/key-reps');

// Welfare
export const getWelfarePrograms = () => apiFetch('/welfare');
export const enrollWelfare = (id: string, userId: string) =>
    apiFetch(`/welfare/${id}/enroll`, { method: 'PUT', body: JSON.stringify({ userId }) });

// Resignations
export const submitResignation = (data: any) =>
    apiFetch('/resignations', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getDashboardData = (userId: string) => apiFetch(`/dashboard/${userId}`);

// PDF Downloads
export const downloadPDF = (type: string, id: string) => {
    window.open(`${API_BASE}/pdf/${type}/${id}`, '_blank');
};
export const downloadLetter = (userId: string, letterType: 'experience' | 'offer') => {
    window.open(`${API_BASE}/pdf/letter/${userId}/${letterType}`, '_blank');
};
