const express = require('express');
const router = express.Router();

// ── MODELS ──
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const LeaveBalance = require('../models/LeaveBalance');
const GatePass = require('../models/GatePass');
const Payroll = require('../models/Payroll');
const Training = require('../models/Training');
const Document = require('../models/Document');
const Project = require('../models/Project');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const Department = require('../models/Department');
const { CanteenMenu, CanteenOrder } = require('../models/Canteen');
const GuestHouse = require('../models/GuestHouse');
const Transport = require('../models/Transport');
const UniformRequest = require('../models/UniformRequest');
const SIMRequest = require('../models/SIMRequest');
const { Asset, AssetRequest } = require('../models/Asset');
const Meeting = require('../models/Meeting');
const Policy = require('../models/Policy');
const Idea = require('../models/Idea');
const GeneralRequest = require('../models/GeneralRequest');
const Request = require('../models/Request');
const AttendanceMissSlip = require('../models/AttendanceMissSlip');
const Resignation = require('../models/Resignation');
const TravelRequest = require('../models/TravelRequest');
const MRF = require('../models/MRF');
const Interview = require('../models/Interview');
const JobDescription = require('../models/JobDescription');
const KeyRepresentative = require('../models/KeyRepresentative');
const WelfareProgram = require('../models/WelfareProgram');
const { generatePayslipPDF, generateGatePassPDF, generateLeavePDF, generateLetterPDF, generateMissSlipPDF, generateTravelPDF } = require('../utils/pdfGenerator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'smg-employee-portal-secret-2024';

// ════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ ...userObj, token });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  USERS
// ════════════════════════════════════════
router.get('/users', async (_req, res) => {
    try { res.json(await User.find().select('-password')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/user/:id', async (req, res) => {
    try { res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  DASHBOARD AGGREGATE
// ════════════════════════════════════════
router.get('/dashboard/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [leaveBalance, pendingLeaves, pendingGP, payroll, trainings, notifications, announcements] = await Promise.all([
            LeaveBalance.findOne({ user: userId, year: new Date().getFullYear() }),
            Leave.countDocuments({ user: userId, status: 'Pending' }),
            GatePass.countDocuments({ user: userId, status: 'Pending' }),
            Payroll.find({ user: userId }).sort({ year: -1 }).limit(1),
            Training.countDocuments({ enrolledUsers: userId }),
            Notification.countDocuments({ user: userId, read: false }),
            Announcement.find({ isActive: true }).sort({ createdAt: -1 }).limit(3).populate('postedBy', 'name')
        ]);
        res.json({
            leaveBalance: leaveBalance ? (leaveBalance.casual.total - leaveBalance.casual.used + leaveBalance.sick.total - leaveBalance.sick.used + leaveBalance.earned.total - leaveBalance.earned.used) : 0,
            pendingRequests: pendingLeaves + pendingGP,
            trainingEnrolled: trainings,
            unreadNotifications: notifications,
            latestPayslip: payroll[0] || null,
            recentAnnouncements: announcements
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ATTENDANCE
// ════════════════════════════════════════
router.get('/attendance/:userId', async (req, res) => {
    try { res.json(await Attendance.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/attendance', async (req, res) => {
    try { res.status(201).json(await Attendance.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/attendance-all', async (_req, res) => {
    try { res.json(await Attendance.find().populate('user', 'name empId dept').sort({ date: -1 }).limit(200)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  LEAVES
// ════════════════════════════════════════
router.get('/leaves/:userId', async (req, res) => {
    try { res.json(await Leave.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/leaves', async (req, res) => {
    try { res.status(201).json(await Leave.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/leaves/:id', async (req, res) => {
    try { res.json(await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/leave-balance/:userId', async (req, res) => {
    try { res.json(await LeaveBalance.findOne({ user: req.params.userId, year: new Date().getFullYear() })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/leaves-all', async (_req, res) => {
    try { res.json(await Leave.find().populate('user', 'name empId dept').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  GATE PASS
// ════════════════════════════════════════
router.get('/gatepasses/:userId', async (req, res) => {
    try { res.json(await GatePass.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/gatepasses', async (req, res) => {
    try { res.status(201).json(await GatePass.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  PAYROLL
// ════════════════════════════════════════
router.get('/payroll/:userId', async (req, res) => {
    try { res.json(await Payroll.find({ user: req.params.userId }).sort({ year: -1, month: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/payroll-all', async (_req, res) => {
    try { res.json(await Payroll.find().populate('user', 'name empId dept').sort({ year: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  TRAINING
// ════════════════════════════════════════
router.get('/trainings', async (_req, res) => {
    try { res.json(await Training.find().populate('enrolledUsers completedUsers', 'name empId')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/trainings', async (req, res) => {
    try { res.status(201).json(await Training.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/trainings/:id/enroll', async (req, res) => {
    try { res.json(await Training.findByIdAndUpdate(req.params.id, { $addToSet: { enrolledUsers: req.body.userId } }, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  DOCUMENTS
// ════════════════════════════════════════
router.get('/documents/:userId', async (req, res) => {
    try { res.json(await Document.find({ user: req.params.userId }).sort({ uploadedAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/documents', async (req, res) => {
    try { res.status(201).json(await Document.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  PROJECTS
// ════════════════════════════════════════
router.get('/projects', async (_req, res) => {
    try { res.json(await Project.find().populate('manager teamMembers', 'name empId dept avatar')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/projects', async (req, res) => {
    try { res.status(201).json(await Project.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/projects/:id', async (req, res) => {
    try { res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ANNOUNCEMENTS
// ════════════════════════════════════════
router.get('/announcements', async (_req, res) => {
    try { res.json(await Announcement.find({ isActive: true }).populate('postedBy', 'name').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/announcements', async (req, res) => {
    try { res.status(201).json(await Announcement.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  NOTIFICATIONS
// ════════════════════════════════════════
router.get('/notifications/:userId', async (req, res) => {
    try { res.json(await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/notifications/:id/read', async (req, res) => {
    try { res.json(await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  DEPARTMENTS
// ════════════════════════════════════════
router.get('/departments', async (_req, res) => {
    try { res.json(await Department.find().populate('head', 'name empId')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/departments', async (req, res) => {
    try { res.status(201).json(await Department.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  CANTEEN
// ════════════════════════════════════════
router.get('/canteen/menu', async (_req, res) => {
    try { res.json(await CanteenMenu.find({ isAvailable: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/canteen/orders/:userId', async (req, res) => {
    try { res.json(await CanteenOrder.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/canteen/orders', async (req, res) => {
    try { res.status(201).json(await CanteenOrder.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  GUEST HOUSE
// ════════════════════════════════════════
router.get('/guesthouse/:userId', async (req, res) => {
    try { res.json(await GuestHouse.find({ user: req.params.userId }).sort({ checkInDate: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/guesthouse', async (req, res) => {
    try { res.status(201).json(await GuestHouse.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  TRANSPORT
// ════════════════════════════════════════
router.get('/transport/:userId', async (req, res) => {
    try { res.json(await Transport.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/transport', async (req, res) => {
    try { res.status(201).json(await Transport.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  UNIFORM REQUESTS
// ════════════════════════════════════════
router.get('/uniforms/:userId', async (req, res) => {
    try { res.json(await UniformRequest.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/uniforms', async (req, res) => {
    try { res.status(201).json(await UniformRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  SIM REQUESTS
// ════════════════════════════════════════
router.get('/sim/:userId', async (req, res) => {
    try { res.json(await SIMRequest.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/sim', async (req, res) => {
    try { res.status(201).json(await SIMRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ASSETS
// ════════════════════════════════════════
router.get('/assets/:userId', async (req, res) => {
    try { res.json(await Asset.find({ user: req.params.userId })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/asset-requests/:userId', async (req, res) => {
    try { res.json(await AssetRequest.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/asset-requests', async (req, res) => {
    try { res.status(201).json(await AssetRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  MEETINGS
// ════════════════════════════════════════
router.get('/meetings/:userId', async (req, res) => {
    try { res.json(await Meeting.find({ participants: req.params.userId }).populate('organizer', 'name').sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  POLICIES
// ════════════════════════════════════════
router.get('/policies', async (_req, res) => {
    try { res.json(await Policy.find({ isActive: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  IDEAS (SMG IMAGINE)
// ════════════════════════════════════════
router.get('/ideas', async (_req, res) => {
    try { res.json(await Idea.find().populate('user', 'name dept').sort({ votes: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/ideas', async (req, res) => {
    try { res.status(201).json(await Idea.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  GENERAL REQUESTS
// ════════════════════════════════════════
router.get('/general-requests/:userId', async (req, res) => {
    try { res.json(await GeneralRequest.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/general-requests', async (req, res) => {
    try { res.status(201).json(await GeneralRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  REQUESTS (LEGACY/DASHBOARD)
// ════════════════════════════════════════
router.get('/requests/:userId', async (req, res) => {
    try { res.json(await Request.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/requests-all', async (_req, res) => {
    try { res.json(await Request.find().populate('user', 'name empId dept').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/requests/:id', async (req, res) => {
    try { res.json(await Request.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  DASHBOARD STATS (aggregated)
// ════════════════════════════════════════
router.get('/dashboard/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const [user, leaveBalance, pendingRequests, notifications, recentRequests, meetings, attendance] = await Promise.all([
            User.findById(userId).select('-password'),
            LeaveBalance.findOne({ user: userId, year: new Date().getFullYear() }),
            Request.countDocuments({ user: userId, status: 'Pending' }),
            Notification.find({ user: userId, isRead: false }).sort({ createdAt: -1 }).limit(5),
            Request.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
            Meeting.find({ participants: userId }).populate('organizer', 'name').sort({ date: -1 }).limit(5),
            Attendance.find({ user: userId }).sort({ date: -1 }).limit(7)
        ]);
        res.json({ user, leaveBalance, pendingRequests, notifications, recentRequests, meetings, attendance });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ADMIN AGGREGATES
// ════════════════════════════════════════
router.get('/admin/dashboard', async (_req, res) => {
    try {
        const totalEmployees = await User.countDocuments();
        const activeEmployees = await User.countDocuments({ status: { $ne: 'Inactive' } });
        const onLeave = await Leave.countDocuments({ status: 'Approved', from: { $lte: new Date() }, to: { $gte: new Date() } });
        const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
        const pendingGatePasses = await GatePass.countDocuments({ status: 'Pending' });
        const completedTraining = await Training.countDocuments({ date: { $lte: new Date() } });
        
        // Mock recent requests for now
        const recentRequests = [
            { id: 'REQ001', employee: 'System Admin', type: 'System Update', date: new Date().toISOString().split('T')[0], status: 'Pending', priority: 'Medium' }
        ];

        res.json({
            stats: {
                totalEmployees,
                activeEmployees,
                onLeave,
                pendingRequests: pendingLeaves + pendingGatePasses,
                monthlyPayroll: '₹1,24,75,000', // Mock
                completedTraining,
                activeProjects: 23, // Mock
                departmentCount: 12 // Mock
            },
            recentRequests,
            departmentStats: [
                { name: 'Production', employees: 450, attendance: 98, budget: '₹45,00,000', color: 'bg-blue-500' },
                { name: 'Quality Control', employees: 125, attendance: 95, budget: '₹12,50,000', color: 'bg-green-500' },
                { name: 'Engineering', employees: 200, attendance: 97, budget: '₹25,00,000', color: 'bg-purple-500' }
            ]
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/requests', async (_req, res) => {
    try {
        const leaves = await Leave.find().populate('user', 'name empId dept');
        const gatePasses = await GatePass.find().populate('user', 'name empId dept');
        
        const requests = [
            ...leaves.map(l => ({ id: l._id, employee: l.user?.name, empId: l.user?.empId, department: l.user?.dept, type: 'Leave Request', category: 'Leave', reason: l.reason, fromDate: l.from, toDate: l.to, days: l.days, submittedOn: l.createdAt, status: l.status, priority: 'Medium' })),
            ...gatePasses.map(g => ({ id: g._id, employee: g.user?.name, empId: g.user?.empId, department: g.user?.dept, type: 'Gate Pass', category: 'Gate Pass', reason: g.reason, fromDate: g.date, toDate: g.date, time: g.outTime, submittedOn: g.createdAt || g.date, status: g.status, priority: 'High' }))
        ].sort((a, b) => new Date(b.submittedOn) - new Date(a.submittedOn));
        
        res.json(requests);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  PDF DOWNLOADS
// ════════════════════════════════════════
router.get('/pdf/payslip/:payrollId', async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.payrollId);
        if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
        const user = await User.findById(payroll.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Payslip_${payroll.month.replace(/\s/g,'_')}.pdf`);
        generatePayslipPDF(payroll, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/gatepass/:id', async (req, res) => {
    try {
        const gatePass = await GatePass.findById(req.params.id);
        if (!gatePass) return res.status(404).json({ message: 'Gate Pass not found' });
        const user = await User.findById(gatePass.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=GatePass_${gatePass.passId}.pdf`);
        generateGatePassPDF(gatePass, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/leave/:id', async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });
        const user = await User.findById(leave.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Leave_Application_${leave._id}.pdf`);
        generateLeavePDF(leave, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/letter/:userId/:type', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const type = req.params.type; // 'experience' or 'offer'
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${type === 'experience' ? 'Experience_Certificate' : 'Offer_Letter'}_${user.empId}.pdf`);
        generateLetterPDF(type, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/miss-slip/:id', async (req, res) => {
    try {
        const slip = await AttendanceMissSlip.findById(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Miss Slip not found' });
        const user = await User.findById(slip.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=MissSlip_${slip.slipId}.pdf`);
        generateMissSlipPDF(slip, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/pdf/travel/:id', async (req, res) => {
    try {
        const travel = await TravelRequest.findById(req.params.id);
        if (!travel) return res.status(404).json({ message: 'Travel Request not found' });
        const user = await User.findById(travel.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Travel_${travel.requestId}.pdf`);
        generateTravelPDF(travel, user).pipe(res);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  ATTENDANCE MISS SLIPS
// ════════════════════════════════════════
router.get('/miss-slips/:userId', async (req, res) => {
    try { res.json(await AttendanceMissSlip.find({ user: req.params.userId }).sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/miss-slips', async (req, res) => {
    try { res.status(201).json(await AttendanceMissSlip.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/miss-slips-all', async (_req, res) => {
    try { res.json(await AttendanceMissSlip.find().populate('user', 'name empId dept').sort({ date: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  RESIGNATIONS
// ════════════════════════════════════════
router.get('/resignations/:userId', async (req, res) => {
    try { res.json(await Resignation.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/resignations', async (req, res) => {
    try { res.status(201).json(await Resignation.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/resignations/:id', async (req, res) => {
    try { res.json(await Resignation.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/resignations-all', async (_req, res) => {
    try { res.json(await Resignation.find().populate('user', 'name empId dept').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  TRAVEL REQUESTS
// ════════════════════════════════════════
router.get('/travel/:userId', async (req, res) => {
    try { res.json(await TravelRequest.find({ user: req.params.userId }).sort({ departureDate: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/travel', async (req, res) => {
    try { res.status(201).json(await TravelRequest.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/travel/:id', async (req, res) => {
    try { res.json(await TravelRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  MRF (MANPOWER REQUISITION)
// ════════════════════════════════════════
router.get('/mrf', async (_req, res) => {
    try { res.json(await MRF.find().populate('requestedBy', 'name empId dept').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/mrf', async (req, res) => {
    try { res.status(201).json(await MRF.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/mrf/:id', async (req, res) => {
    try { res.json(await MRF.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  INTERVIEWS
// ════════════════════════════════════════
router.get('/interviews', async (_req, res) => {
    try { res.json(await Interview.find().populate('mrf').sort({ interviewDate: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/interviews', async (req, res) => {
    try { res.status(201).json(await Interview.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/interviews/:id', async (req, res) => {
    try { res.json(await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  JOB DESCRIPTIONS
// ════════════════════════════════════════
router.get('/job-descriptions', async (_req, res) => {
    try { res.json(await JobDescription.find({ isActive: true }).populate('createdBy', 'name')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/job-descriptions', async (req, res) => {
    try { res.status(201).json(await JobDescription.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  KEY REPRESENTATIVES
// ════════════════════════════════════════
router.get('/key-reps', async (_req, res) => {
    try { res.json(await KeyRepresentative.find({ isActive: true }).populate('user', 'name empId avatar phone')); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/key-reps', async (req, res) => {
    try { res.status(201).json(await KeyRepresentative.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// ════════════════════════════════════════
//  WELFARE PROGRAMS
// ════════════════════════════════════════
router.get('/welfare', async (_req, res) => {
    try { res.json(await WelfareProgram.find({ isActive: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/welfare', async (req, res) => {
    try { res.status(201).json(await WelfareProgram.create(req.body)); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/welfare/:id/enroll', async (req, res) => {
    try { res.json(await WelfareProgram.findByIdAndUpdate(req.params.id, { $addToSet: { enrolledUsers: req.body.userId } }, { new: true })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
