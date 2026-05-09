const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const LeaveBalance = require('./models/LeaveBalance');
const GatePass = require('./models/GatePass');
const Payroll = require('./models/Payroll');
const Training = require('./models/Training');
const Document = require('./models/Document');
const Project = require('./models/Project');
const Announcement = require('./models/Announcement');
const Notification = require('./models/Notification');
const Department = require('./models/Department');
const { CanteenMenu } = require('./models/Canteen');
const GuestHouse = require('./models/GuestHouse');
const Transport = require('./models/Transport');
const UniformRequest = require('./models/UniformRequest');
const SIMRequest = require('./models/SIMRequest');
const { Asset } = require('./models/Asset');
const Meeting = require('./models/Meeting');
const Policy = require('./models/Policy');
const Idea = require('./models/Idea');
const GeneralRequest = require('./models/GeneralRequest');
const Request = require('./models/Request');
const AttendanceMissSlip = require('./models/AttendanceMissSlip');
const Resignation = require('./models/Resignation');
const TravelRequest = require('./models/TravelRequest');
const MRF = require('./models/MRF');
const Interview = require('./models/Interview');
const JobDescription = require('./models/JobDescription');
const KeyRepresentative = require('./models/KeyRepresentative');
const WelfareProgram = require('./models/WelfareProgram');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee-portal');
    console.log('Connected to MongoDB for seeding...');

    // Clear all collections
    const collections = [User, Attendance, Leave, LeaveBalance, GatePass, Payroll, Training, Document, Project, Announcement, Notification, Department, CanteenMenu, GuestHouse, Transport, UniformRequest, SIMRequest, Asset, Meeting, Policy, Idea, GeneralRequest, Request, AttendanceMissSlip, Resignation, TravelRequest, MRF, Interview, JobDescription, KeyRepresentative, WelfareProgram];
    for (const Model of collections) { await Model.deleteMany({}); }
    console.log('Cleared all collections.');

    // Hash password with bcrypt
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password', 10);

    // ── USERS ──
    const users = await User.insertMany([
        { name:"Rohit Sharma", email:"employee@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2024-042", dept:"Assembly", designation:"Senior Technician", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit&backgroundColor=b6e3f4", shift:"General (9:00 - 18:00)", reportingTo:"Priya Sharma", phone:"+91 98765 43210", emergencyContact:"+91 98765 43211", dateOfBirth:"15-Aug-1992", dateOfJoining:"10-Jan-2020", bloodGroup:"O+", address:"Flat 402, Green Valley Apartments, Sector 12, Noida, UP - 201301", education:[{degree:"B.Tech in Mechanical Engineering",institution:"Delhi Technical University",year:"2010-2014",grade:"8.2 CGPA"},{degree:"Senior Secondary (XII)",institution:"DAV Public School",year:"2010",grade:"88%"}], certifications:[{name:"Six Sigma Green Belt",issuer:"ASQ",year:"2021"},{name:"Industrial Safety",issuer:"NSCI",year:"2020"},{name:"Quality Management",issuer:"ISO",year:"2019"}], skills:["Assembly Line Operations","Quality Control","Safety Compliance","Technical Documentation","Team Leadership"], languages:["Hindi (Native)","English (Fluent)","Punjabi (Conversational)"] },
        { name:"Priya Sharma", email:"admin@smg.com", password:hashedPassword, role:"admin", empId:"SMG-2020-005", dept:"Assembly", designation:"Assembly Manager", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc", shift:"General (9:00 - 18:00)", reportingTo:"Vikram Singh", phone:"+91 98765 11111", dateOfBirth:"22-Mar-1988", dateOfJoining:"05-Mar-2018", bloodGroup:"A+", address:"House 12, Sector 44, Gurugram", skills:["Team Management","Production Planning","Lean Manufacturing"], languages:["Hindi","English"] },
        { name:"Amit Kumar", email:"hr@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2022-018", dept:"HR", designation:"HR Manager", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=c0aede", shift:"General (9:00 - 18:00)", reportingTo:"Vikram Singh", phone:"+91 98765 22222", dateOfBirth:"10-Jun-1990", dateOfJoining:"15-Jul-2019", bloodGroup:"B+", address:"Flat 201, Palm Heights, Noida", skills:["Recruitment","Employee Relations","Payroll Management"], languages:["Hindi","English"] },
        { name:"Sneha Patel", email:"it@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2023-031", dept:"IT", designation:"IT Support Lead", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha&backgroundColor=b6e3f4", shift:"General (9:00 - 18:00)", reportingTo:"Priya Sharma", phone:"+91 98765 33333", dateOfBirth:"05-Nov-1995", dateOfJoining:"20-Feb-2021", bloodGroup:"O-", address:"B-14, Arun Vihar, Noida", skills:["Networking","Cloud Infrastructure","Cybersecurity"], languages:["Hindi","English","Gujarati"] },
        { name:"Vikram Singh", email:"superadmin@smg.com", password:hashedPassword, role:"superadmin", empId:"SMG-2015-001", dept:"Management", designation:"VP Operations", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=ffd5dc", shift:"General (9:00 - 18:00)", reportingTo:"CEO", phone:"+91 98765 44444", dateOfBirth:"18-Jan-1980", dateOfJoining:"01-Jan-2015", bloodGroup:"AB+", address:"Villa 8, DLF Phase 3, Gurugram", skills:["Strategic Planning","Operations Management","P&L Management"], languages:["Hindi","English","Punjabi"] },
        { name:"Arjun Mehta", email:"qc@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2021-025", dept:"Quality", designation:"QC Engineer", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=c0aede", shift:"Morning (6:00 - 14:00)", reportingTo:"Priya Sharma", phone:"+91 98765 55555", dateOfBirth:"30-Sep-1993", dateOfJoining:"12-Aug-2021", bloodGroup:"B-", address:"C-22, Vasundhara, Ghaziabad", skills:["Quality Inspection","Six Sigma","Root Cause Analysis"], languages:["Hindi","English"] },
        { name:"Sneha Reddy", email:"training@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2022-033", dept:"Training", designation:"Training Coordinator", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=SReddy&backgroundColor=b6e3f4", shift:"General (9:00 - 18:00)", reportingTo:"Amit Kumar", phone:"+91 98765 66666", dateOfBirth:"14-Jul-1991", dateOfJoining:"01-Apr-2022", bloodGroup:"A-", address:"D-5, Sector 62, Noida", skills:["L&D","Workshop Facilitation","Content Design"], languages:["Hindi","English","Telugu"] },
        { name:"Ravi Teja", email:"production@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2023-040", dept:"Production", designation:"Production Supervisor", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi&backgroundColor=ffd5dc", shift:"Evening (14:00 - 22:00)", reportingTo:"Priya Sharma", phone:"+91 98765 77777", dateOfBirth:"25-Dec-1994", dateOfJoining:"10-Jun-2023", bloodGroup:"O+", address:"E-Block, Indirapuram, Ghaziabad", skills:["Production Control","Inventory Management","5S Methodology"], languages:["Hindi","English","Telugu"] }
    ]);
    console.log(`Seeded ${users.length} users.`);
    const rohit = users[0], priya = users[1], amit = users[2], sneha = users[3], vikram = users[4], arjun = users[5];

    // ── DEPARTMENTS ──
    await Department.insertMany([
        { name:"Assembly", code:"ASSY", head:priya._id, description:"Vehicle assembly and integration", employeeCount:45, location:"Plant A - Building 1", budget:5000000 },
        { name:"Human Resources", code:"HR", head:amit._id, description:"People operations and talent management", employeeCount:12, location:"Corporate Office - Floor 2", budget:2000000 },
        { name:"Information Technology", code:"IT", head:sneha._id, description:"IT infrastructure and digital solutions", employeeCount:18, location:"Corporate Office - Floor 3", budget:4000000 },
        { name:"Quality Control", code:"QC", head:arjun._id, description:"Quality assurance and product testing", employeeCount:20, location:"Plant A - Building 2", budget:3000000 },
        { name:"Production", code:"PROD", description:"Manufacturing and production operations", employeeCount:60, location:"Plant A - Main Hall", budget:8000000 },
        { name:"Management", code:"MGMT", head:vikram._id, description:"Senior leadership and strategic planning", employeeCount:5, location:"Corporate Office - Floor 5", budget:1000000 },
        { name:"Training", code:"TRN", description:"Learning and development programs", employeeCount:8, location:"Training Center", budget:1500000 },
        { name:"Finance", code:"FIN", description:"Financial planning and accounting", employeeCount:10, location:"Corporate Office - Floor 1", budget:1200000 }
    ]);
    console.log('Seeded departments.');

    // ── ATTENDANCE (last 10 days for Rohit) ──
    const today = new Date();
    const attData = [];
    for (let i = 0; i < 10; i++) {
        const d = new Date(today); d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US',{weekday:'long'});
        if (dayName === 'Sunday' || dayName === 'Saturday') {
            attData.push({ user:rohit._id, date:d, day:dayName, checkIn:'-', checkOut:'-', duration:'-', status:'Weekend', isLeave:false, segments:[] });
        } else if (i === 3) {
            attData.push({ user:rohit._id, date:d, day:dayName, checkIn:'-', checkOut:'-', duration:'-', status:'Leave', isLeave:true, segments:[] });
        } else {
            const late = i === 5;
            const segs = late
                ? [{type:'late',width:'5%',color:'bg-[#EE5D50]'},{type:'work',width:'40%',color:'bg-[#0B4DA2]'},{type:'break',width:'10%',color:'bg-[#05CD99]'},{type:'work',width:'45%',color:'bg-[#0B4DA2]'}]
                : [{type:'work',width:'40%',color:'bg-[#0B4DA2]'},{type:'break',width:'10%',color:'bg-[#05CD99]'},{type:'work',width:'30%',color:'bg-[#0B4DA2]'},{type:'overtime',width:'20%',color:'bg-[#FFB547]'}];
            attData.push({ user:rohit._id, date:d, day: i===0?'Today':dayName, checkIn:late?'09:15 AM':'08:55 AM', checkOut:'06:12 PM', duration:late?'8h 57m':'9h 17m', status:late?'Late':'Present', isLeave:false, segments:segs, overtimeHours:late?0:1.28, lateMinutes:late?15:0 });
        }
    }
    await Attendance.insertMany(attData);
    console.log('Seeded attendance.');

    // ── LEAVE BALANCE ──
    await LeaveBalance.insertMany([
        { user:rohit._id, year:2024, annualTotal:20, annualUsed:8, sickTotal:10, sickUsed:2, casualTotal:8, casualUsed:3 },
        { user:priya._id, year:2024, annualTotal:20, annualUsed:5, sickTotal:10, sickUsed:1, casualTotal:8, casualUsed:2 },
        { user:amit._id, year:2024, annualTotal:20, annualUsed:6, sickTotal:10, sickUsed:3, casualTotal:8, casualUsed:1 }
    ]);

    // ── LEAVES ──
    await Leave.insertMany([
        { user:rohit._id, type:'Annual Leave', from:new Date('2024-12-20'), to:new Date('2024-12-24'), days:5, reason:'Diwali Vacation', status:'Approved', approver:'Priya Sharma' },
        { user:rohit._id, type:'Sick Leave', from:new Date('2024-11-15'), to:new Date('2024-11-15'), days:1, reason:'Fever', status:'Approved', approver:'Priya Sharma' },
        { user:rohit._id, type:'Casual Leave', from:new Date('2024-12-30'), to:new Date('2024-12-31'), days:2, reason:'Personal Work', status:'Pending', approver:'Priya Sharma' },
        { user:rohit._id, type:'Annual Leave', from:new Date('2024-10-10'), to:new Date('2024-10-12'), days:3, reason:'Family Function', status:'Rejected', approver:'Priya Sharma' },
        { user:priya._id, type:'Annual Leave', from:new Date('2024-12-25'), to:new Date('2024-12-27'), days:3, reason:'Christmas Break', status:'Approved', approver:'Vikram Singh' }
    ]);
    console.log('Seeded leaves.');

    // ── GATE PASSES ──
    await GatePass.insertMany([
        { user:rohit._id, passId:'GP-2024-001', type:'Personal', outTime:'11:00 AM', inTime:'01:00 PM', date:new Date('2024-12-10'), reason:'Bank work', status:'Completed', approver:'Priya Sharma' },
        { user:rohit._id, passId:'GP-2024-002', type:'Medical', outTime:'03:00 PM', inTime:'05:30 PM', date:new Date('2024-12-08'), reason:'Doctor appointment', status:'Completed', approver:'Priya Sharma' },
        { user:rohit._id, passId:'GP-2024-003', type:'Official', outTime:'10:00 AM', date:new Date('2024-12-12'), reason:'Client meeting at Manesar plant', status:'Approved', approver:'Priya Sharma' }
    ]);

    // ── PAYROLL (last 6 months for Rohit) ──
    const months = ['July 2024','August 2024','September 2024','October 2024','November 2024','December 2024'];
    const payrolls = months.map(m => ({ user:rohit._id, month:m, year:2024, basicSalary:45000, hra:22500, allowances:12000, specialAllowance:5000, conveyance:3000, medicalAllowance:2500, pf:5400, tax:3500, professionalTax:200, otherDeductions:900, grossSalary:90000, totalDeductions:10000, netSalary:80000, status:'Paid', paidOn:new Date() }));
    await Payroll.insertMany(payrolls);
    console.log('Seeded payroll.');

    // ── TRAININGS ──
    const trainings = await Training.insertMany([
        { title:'React Advanced Patterns', description:'Deep dive into React hooks, context, and performance optimization', date:new Date('2024-12-18'), duration:'4 hours', instructor:'Vikram Singh', type:'Required', category:'Technical', department:'All', enrolledUsers:[rohit._id,sneha._id], status:'Upcoming' },
        { title:'AWS Cloud Fundamentals', description:'Introduction to AWS services and cloud architecture', date:new Date('2024-12-25'), duration:'8 hours', instructor:'Sneha Reddy', type:'Optional', category:'Technical', department:'IT', status:'Upcoming' },
        { title:'Agile & Scrum Workshop', description:'Practical agile methodologies for manufacturing teams', date:new Date('2025-01-05'), duration:'6 hours', instructor:'Arjun Mehta', type:'Required', category:'Management', department:'All', enrolledUsers:[rohit._id,priya._id,arjun._id], status:'Upcoming' },
        { title:'Six Sigma Green Belt Training', description:'Comprehensive six sigma methodology', date:new Date('2024-08-15'), duration:'40 hours', instructor:'External', type:'Required', category:'Quality', completedUsers:[rohit._id,arjun._id], status:'Completed' },
        { title:'Industrial Safety Certification', description:'Workplace safety standards and practices', date:new Date('2024-06-20'), duration:'16 hours', instructor:'Safety Officer', type:'Required', category:'Safety', completedUsers:[rohit._id,priya._id], status:'Completed' }
    ]);
    console.log('Seeded trainings.');

    // ── DOCUMENTS ──
    await Document.insertMany([
        { user:rohit._id, title:'Offer Letter', category:'Onboarding', fileType:'PDF', fileSize:'245 KB', uploadedAt:new Date('2020-01-10') },
        { user:rohit._id, title:'ID Proof - Aadhaar', category:'Identity', fileType:'PDF', fileSize:'180 KB', uploadedAt:new Date('2020-01-12') },
        { user:rohit._id, title:'PAN Card', category:'Tax Documents', fileType:'PDF', fileSize:'120 KB', uploadedAt:new Date('2020-01-12') },
        { user:rohit._id, title:'Experience Certificate', category:'Certificates', fileType:'PDF', fileSize:'156 KB', uploadedAt:new Date('2021-02-20') },
        { user:rohit._id, title:'Payslip - October 2024', category:'Payroll', fileType:'PDF', fileSize:'98 KB', uploadedAt:new Date('2024-11-01') },
        { user:rohit._id, title:'Tax Declaration Form', category:'Tax Documents', fileType:'PDF', fileSize:'210 KB', uploadedAt:new Date('2024-04-05') },
        { user:rohit._id, title:'Six Sigma Certificate', category:'Certificates', fileType:'PDF', fileSize:'320 KB', uploadedAt:new Date('2021-09-01') }
    ]);
    console.log('Seeded documents.');

    // ── PROJECTS ──
    await Project.insertMany([
        { name:'EV Scooter Gen-3 Assembly Line', description:'Setup new assembly line for Gen-3 electric scooter', department:'Assembly', status:'In Progress', priority:'Critical', startDate:new Date('2024-10-01'), endDate:new Date('2025-03-31'), progress:42, manager:priya._id, teamMembers:[rohit._id,arjun._id], budget:15000000, tags:['Manufacturing','EV','Critical'] },
        { name:'Employee Portal Development', description:'Build cloud-based employee management portal', department:'IT', status:'In Progress', priority:'High', startDate:new Date('2024-09-15'), endDate:new Date('2025-01-31'), progress:75, manager:sneha._id, teamMembers:[rohit._id,sneha._id], budget:2000000, tags:['Software','Internal','Cloud'] },
        { name:'Quality Audit - Q4 2024', description:'Quarterly quality audit for all production lines', department:'Quality', status:'Completed', priority:'High', startDate:new Date('2024-10-01'), endDate:new Date('2024-12-15'), progress:100, manager:arjun._id, budget:500000, tags:['Quality','Audit'] },
        { name:'Safety Training Program 2025', description:'Annual safety training rollout', department:'Training', status:'Planning', priority:'Medium', startDate:new Date('2025-01-15'), endDate:new Date('2025-06-30'), progress:10, budget:800000, tags:['Safety','Training'] }
    ]);
    console.log('Seeded projects.');

    // ── ANNOUNCEMENTS ──
    await Announcement.insertMany([
        { title:'Holiday Announcement - Diwali 2024', content:'Office will remain closed from Dec 20 to Dec 24 for Diwali celebrations. Wishing everyone a Happy Diwali!', priority:'High', department:'All', postedBy:vikram._id },
        { title:'New Cafeteria Menu Launch', content:'We are excited to announce a revamped cafeteria menu with healthier options starting next week.', priority:'Medium', department:'All', postedBy:amit._id },
        { title:'Safety Drill - December', content:'Mandatory fire and earthquake safety drill scheduled for Dec 15. All employees must participate.', priority:'High', department:'All', postedBy:vikram._id },
        { title:'Year-End Performance Reviews', content:'Performance review cycle begins Jan 5, 2025. Please complete your self-assessments by Dec 31.', priority:'High', department:'All', postedBy:amit._id },
        { title:'Parking Lot Expansion', content:'New parking area near Building 2 will be operational from Jan 1, 2025.', priority:'Low', department:'All', postedBy:amit._id }
    ]);
    console.log('Seeded announcements.');

    // ── NOTIFICATIONS ──
    await Notification.insertMany([
        { user:rohit._id, title:'Leave Approved', message:'Your leave request for Dec 20-24 has been approved by Priya Sharma', type:'success', category:'Leave' },
        { user:rohit._id, title:'New Training Assigned', message:'React Advanced Patterns training assigned for Dec 18', type:'info', category:'Training' },
        { user:rohit._id, title:'Payslip Available', message:'October 2024 payslip is ready for download', type:'info', category:'Payroll' },
        { user:rohit._id, title:'Document Expiring', message:'Your ID proof document needs to be updated', type:'warning', category:'Other' },
        { user:rohit._id, title:'Project Update', message:'EV Scooter Gen-3 milestone completed - Phase 2 begins', type:'success', category:'Other' },
        { user:rohit._id, title:'Safety Drill Reminder', message:'Mandatory safety drill on Dec 15 at 3 PM', type:'warning', category:'Announcement' }
    ]);
    console.log('Seeded notifications.');

    // ── REQUESTS ──
    await Request.insertMany([
        { user:rohit._id, reqId:'REQ001', type:'Leave Application', description:'Annual Leave - Diwali Vacation', status:'Approved', approver:'Priya Sharma' },
        { user:rohit._id, reqId:'REQ002', type:'Reimbursement', description:'Travel Expense - Client Visit Mumbai', status:'Pending', approver:'Amit Patel' },
        { user:rohit._id, reqId:'REQ003', type:'Asset Request', description:'New Laptop - MacBook Pro', status:'In Progress', approver:'IT Admin' },
        { user:rohit._id, reqId:'REQ004', type:'Certificate Request', description:'Experience Certificate', status:'Approved', approver:'HR Team' },
        { user:priya._id, reqId:'REQ005', type:'Leave Application', description:'Christmas Break', status:'Approved', approver:'Vikram Singh' }
    ]);

    // ── CANTEEN MENU ──
    await CanteenMenu.insertMany([
        { name:'Masala Dosa', category:'Breakfast', price:40, description:'Crispy dosa with potato filling', isVeg:true, day:'All' },
        { name:'Poha', category:'Breakfast', price:30, description:'Flattened rice with vegetables', isVeg:true, day:'All' },
        { name:'Paneer Butter Masala', category:'Lunch', price:80, description:'Rich paneer curry', isVeg:true, day:'All' },
        { name:'Chicken Biryani', category:'Lunch', price:120, description:'Hyderabadi style biryani', isVeg:false, day:'Thursday' },
        { name:'Dal Makhani Thali', category:'Lunch', price:90, description:'Complete thali with dal, rice, roti, salad', isVeg:true, day:'All' },
        { name:'Samosa', category:'Snacks', price:15, description:'Crispy potato samosa', isVeg:true, day:'All' },
        { name:'Tea', category:'Beverages', price:10, description:'Masala chai', isVeg:true, day:'All' },
        { name:'Coffee', category:'Beverages', price:20, description:'Filter coffee', isVeg:true, day:'All' }
    ]);
    console.log('Seeded canteen menu.');

    // ── ASSETS ──
    await Asset.insertMany([
        { user:rohit._id, assetId:'AST-001', name:'Dell Latitude 5520', type:'Laptop', brand:'Dell', serialNumber:'DL5520-2024-001', condition:'Good', assignedDate:new Date('2020-01-15'), status:'Assigned' },
        { user:rohit._id, assetId:'AST-002', name:'iPhone 13 Pro', type:'Mobile', brand:'Apple', serialNumber:'IP13P-2024-042', condition:'Excellent', assignedDate:new Date('2023-06-01'), status:'Assigned' },
        { user:rohit._id, assetId:'AST-003', name:'Dell Monitor 24"', type:'Monitor', brand:'Dell', serialNumber:'DLM24-2024-015', condition:'Good', assignedDate:new Date('2020-01-15'), status:'Assigned' },
        { user:rohit._id, assetId:'AST-004', name:'Logitech MX Keys', type:'Keyboard', brand:'Logitech', serialNumber:'LMK-2024-030', condition:'Fair', assignedDate:new Date('2022-03-10'), status:'Assigned' }
    ]);

    // ── MEETINGS ──
    await Meeting.insertMany([
        { title:'Team Standup', date:today, time:'10:00 AM', duration:'30 min', type:'Conference Room', location:'Conference Room A', organizer:priya._id, participants:[rohit._id,arjun._id], agenda:'Daily progress update', status:'Scheduled' },
        { title:'Project Review', date:today, time:'02:00 PM', duration:'1 hour', type:'Online', link:'meet.google.com/abc-defg-hij', organizer:sneha._id, participants:[rohit._id,sneha._id], agenda:'Sprint review and demo', status:'Scheduled' },
        { title:'Safety Training', date:today, time:'04:00 PM', duration:'45 min', type:'Training Hall', location:'Training Hall B', organizer:vikram._id, participants:[rohit._id,priya._id,arjun._id], agenda:'Monthly safety briefing', status:'Scheduled' }
    ]);

    // ── POLICIES ──
    await Policy.insertMany([
        { title:'Code of Conduct', category:'Code of Conduct', content:'All employees are expected to maintain professional behavior...', version:'2.1', effectiveDate:new Date('2024-01-01') },
        { title:'Leave Policy', category:'Leave Policy', content:'Annual leave: 20 days, Sick leave: 10 days, Casual leave: 8 days...', version:'3.0', effectiveDate:new Date('2024-04-01') },
        { title:'IT Security Policy', category:'IT Security', content:'All company data must be handled securely. Use VPN for remote access...', version:'1.5', effectiveDate:new Date('2024-06-01') },
        { title:'HR Policies', category:'HR Policies', content:'Recruitment, onboarding, performance management guidelines...', version:'2.0', effectiveDate:new Date('2024-01-01') }
    ]);

    // ── IDEAS ──
    await Idea.insertMany([
        { user:rohit._id, title:'Solar Panel on Factory Roof', description:'Install solar panels to reduce electricity costs by 30%', category:'Cost Saving', status:'Under Review', votes:15 },
        { user:arjun._id, title:'Automated QC Station', description:'Use AI vision for automated quality checks on assembly line', category:'Process', status:'Approved', votes:22 }
    ]);

    // ── GENERAL REQUESTS ──
    await GeneralRequest.insertMany([
        { user:rohit._id, reqId:'GR-001', category:'IT Support', subject:'VPN Access Issue', description:'Unable to connect to company VPN from home', status:'Resolved', assignedTo:'Sneha Patel', priority:'High' },
        { user:rohit._id, reqId:'GR-002', category:'Facilities', subject:'AC Not Working', description:'Air conditioning unit in Bay 3 not functioning', status:'In Progress', assignedTo:'Facilities Team', priority:'Medium' }
    ]);

    // ── ATTENDANCE MISS SLIPS ──
    await AttendanceMissSlip.insertMany([
        { user:rohit._id, slipId:'AMS-2024-001', date:new Date('2024-12-05'), missType:'Check-Out Missing', actualCheckIn:'08:55 AM', actualCheckOut:'06:10 PM', reason:'Forgot to punch out - was on urgent call', status:'Approved', approver:'Priya Sharma' },
        { user:rohit._id, slipId:'AMS-2024-002', date:new Date('2024-11-20'), missType:'Check-In Missing', actualCheckIn:'09:00 AM', actualCheckOut:'05:45 PM', reason:'Biometric machine was not working', status:'Approved', approver:'Priya Sharma' }
    ]);

    // ── TRAVEL REQUESTS ──
    await TravelRequest.insertMany([
        { user:rohit._id, requestId:'TR-2024-001', travelType:'Domestic', purpose:'Client visit for EV Scooter demo', fromCity:'Gurugram', toCity:'Mumbai', departureDate:new Date('2024-11-25'), returnDate:new Date('2024-11-27'), travelMode:'Flight', accommodation:true, estimatedCost:25000, status:'Completed', approver:'Priya Sharma', expenses:[{category:'Travel',description:'Flight tickets',amount:12000,receiptAttached:true},{category:'Hotel',description:'2 nights at Hyatt',amount:8000,receiptAttached:true},{category:'Food',description:'Meals during trip',amount:3000,receiptAttached:false}], totalExpense:23000, reimbursedAmount:23000 },
        { user:rohit._id, requestId:'TR-2024-002', travelType:'Local', purpose:'Vendor meeting at Manesar', fromCity:'Gurugram', toCity:'Manesar', departureDate:new Date('2024-12-15'), returnDate:new Date('2024-12-15'), travelMode:'Car', accommodation:false, estimatedCost:2000, status:'Pending', approver:'Priya Sharma' }
    ]);

    // ── MRF ──
    const mrfs = await MRF.insertMany([
        { mrfId:'MRF-2024-001', requestedBy:priya._id, department:'Assembly', jobTitle:'Assembly Technician', numberOfPositions:3, employmentType:'Full-Time', experience:'2-4 years', qualification:'ITI/Diploma in Mechanical', skills:['Assembly','Welding','Quality Check'], budgetRange:{min:25000,max:35000}, justification:'Expansion of Gen-3 production line', expectedJoiningDate:new Date('2025-02-01'), priority:'High', status:'In Recruitment', approver:'Vikram Singh' },
        { mrfId:'MRF-2024-002', requestedBy:sneha._id, department:'IT', jobTitle:'Full Stack Developer', numberOfPositions:1, employmentType:'Full-Time', experience:'3-5 years', qualification:'B.Tech in CS/IT', skills:['React','Node.js','MongoDB'], budgetRange:{min:60000,max:90000}, justification:'Portal development team expansion', expectedJoiningDate:new Date('2025-01-15'), priority:'Medium', status:'Pending Approval', approver:'Vikram Singh' }
    ]);

    // ── INTERVIEWS ──
    await Interview.insertMany([
        { interviewId:'INT-2024-001', candidateName:'Rahul Verma', position:'Assembly Technician', department:'Assembly', interviewDate:new Date('2024-12-18'), interviewers:['Priya Sharma','Arjun Mehta'], rounds:[{roundName:'Technical',score:7,remarks:'Good practical skills',result:'Pass'},{roundName:'HR',score:8,remarks:'Good communication',result:'Pass'}], overallScore:7.5, recommendation:'Recommend', status:'Completed', mrf:mrfs[0]._id },
        { interviewId:'INT-2024-002', candidateName:'Kavya Iyer', position:'Full Stack Developer', department:'IT', interviewDate:new Date('2024-12-20'), interviewers:['Sneha Patel'], rounds:[{roundName:'Coding Test',score:9,remarks:'Excellent problem solving',result:'Pass'}], overallScore:9, recommendation:'Strongly Recommend', status:'Scheduled', mrf:mrfs[1]._id }
    ]);

    // ── JOB DESCRIPTIONS ──
    await JobDescription.insertMany([
        { jdId:'JD-2024-001', title:'Assembly Technician', department:'Assembly', reportingTo:'Assembly Manager', location:'Plant A', employmentType:'Full-Time', summary:'Responsible for assembling EV scooter components', responsibilities:['Assemble mechanical and electrical components','Perform quality checks','Follow safety protocols','Report defects'], qualifications:['ITI/Diploma in Mechanical Engineering'], experience:'2-4 years in manufacturing', skillsRequired:['Assembly','Welding','Blueprint Reading'], salaryRange:{min:25000,max:35000}, createdBy:priya._id },
        { jdId:'JD-2024-002', title:'Full Stack Developer', department:'IT', reportingTo:'IT Lead', location:'Corporate Office', employmentType:'Full-Time', summary:'Develop and maintain internal web applications', responsibilities:['Build React frontends','Develop Node.js APIs','Manage MongoDB databases','Deploy to cloud'], qualifications:['B.Tech/MCA in Computer Science'], experience:'3-5 years', skillsRequired:['React','Node.js','MongoDB','AWS'], salaryRange:{min:60000,max:90000}, createdBy:sneha._id }
    ]);

    // ── KEY REPRESENTATIVES ──
    await KeyRepresentative.insertMany([
        { user:amit._id, department:'HR', role:'HR Manager', responsibilities:['Employee grievances','Recruitment','Policy implementation'], contactNumber:'+91 98765 22222', email:'hr@smg.com', location:'Corporate Office - Floor 2' },
        { user:sneha._id, department:'IT', role:'IT Support Lead', responsibilities:['IT infrastructure','Network security','Software support'], contactNumber:'+91 98765 33333', email:'it@smg.com', location:'Corporate Office - Floor 3' },
        { user:vikram._id, department:'Management', role:'VP Operations - Safety Officer', responsibilities:['Workplace safety','Emergency response','Safety audits'], contactNumber:'+91 98765 44444', email:'superadmin@smg.com', location:'Corporate Office - Floor 5' }
    ]);

    // ── WELFARE PROGRAMS ──
    await WelfareProgram.insertMany([
        { title:'Group Health Insurance', category:'Health Insurance', description:'Comprehensive health insurance covering employee, spouse, and 2 children up to ₹5 Lakhs', eligibility:'All confirmed employees', benefits:['Cashless hospitalization','Pre & post hospitalization cover','Maternity benefits','Annual health checkup'], enrolledUsers:[rohit._id,priya._id,amit._id,sneha._id], contactPerson:'Amit Kumar', contactEmail:'hr@smg.com' },
        { title:'Wellness Wednesday', category:'Wellness Programs', description:'Weekly wellness sessions including yoga, meditation, and fitness workshops every Wednesday', eligibility:'All employees', benefits:['Free yoga sessions','Mental health counseling','Fitness gym access','Nutrition guidance'], contactPerson:'Sneha Reddy', contactEmail:'training@smg.com' },
        { title:'Emergency Financial Assistance', category:'Emergency Support', description:'Interest-free emergency loan up to 2 months salary for medical or family emergencies', eligibility:'Employees with 1+ year tenure', benefits:['Interest-free loan','Quick disbursement within 48 hours','Flexible repayment over 12 months'], contactPerson:'Amit Kumar', contactEmail:'hr@smg.com' }
    ]);

    console.log('Seeded all new collections (miss slips, travel, MRF, interviews, JDs, key reps, welfare).');

    console.log('\n✅ Database seeded successfully with comprehensive data!');
    console.log('Login credentials:');
    console.log('  Employee   → employee@smg.com / password');
    console.log('  Admin      → admin@smg.com / password');
    console.log('  SuperAdmin → superadmin@smg.com / password');
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
