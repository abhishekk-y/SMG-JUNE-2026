import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContextEnhanced';
import { Login } from './components/Login';
import { DashboardPage } from './pages/DashboardPage';
import { DashboardPageOld } from './pages/DashboardPageOld';
import { MyAttendancePageOld } from './pages/MyAttendancePageOld';
import { MyProfilePageOld } from './pages/MyProfilePageOld';
import { PayrollPageOld } from './pages/PayrollPageOld';
import { TrainingPageOld } from './pages/TrainingPageOld';
import { MyDocumentsPageOld } from './pages/MyDocumentsPageOld';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProjectsPage } from './pages/ProjectsPageEnhanced';
import { ProfilePage } from './pages/ProfilePage';
import { CanteenPage } from './pages/CanteenPage';
import { GuestHousePage } from './pages/GuestHousePage';
import { TransportPage } from './pages/TransportPage';
import { LeavesPage } from './pages/LeavesPage';
import { AttendancePage } from './pages/AttendancePage';
import { GatePassPage } from './pages/GatePassPage';
import { DepartmentPortalHub } from './pages/DepartmentPortalHub';
// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsEnhanced';
import {
  AdminUsersPage,
  AdminAttendancePage,
  AdminTrainingPage,
  AdminAnnouncementsPage,
  AdminProductionPage,
  AdminPayrollPage
} from './pages/admin/AdminOtherPagesEnhanced';
import { AdminProjectsPage } from './pages/admin/AdminProjectsEnhanced';
// Super Admin Pages
import { SuperAdminSidebar } from './components/SuperAdminSidebar';
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { SuperAdminUsersPage } from './pages/superadmin/SuperAdminUsersPage';
import { SuperAdminDepartmentsPage } from './pages/superadmin/SuperAdminDepartmentsPage';
import { SuperAdminRequestsPage } from './pages/superadmin/SuperAdminRequestsPage';
import { SuperAdminAnalyticsPage } from './pages/superadmin/SuperAdminAnalyticsPage';
import { SuperAdminAnnouncementsPage } from './pages/superadmin/SuperAdminAnnouncementsPage';
import { SuperAdminNotificationsPage } from './pages/superadmin/SuperAdminNotificationsPage';
import { SuperAdminSettingsPage } from './pages/superadmin/SuperAdminSettingsPage';
import { SuperAdminReportsPage } from './pages/superadmin/SuperAdminReportsPage';
import { UniformPage } from './pages/UniformPage';
import {
  SIMAllocationPage,
  AssetRequestsPage,
  GeneralRequestsPage,
  MyAttendancePage,
  PayrollPage,
  TrainingPage,
  DocumentsPage,
  WelfarePage,
  ImaginePage,
  PoliciesPage,
  AnnouncementsPage
} from './pages/OtherPages';
import {
  LayoutDashboard,
  Briefcase,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  Heart,
  ShoppingBag,
  Settings,
  Coffee,
  MapPin,
  Mail,
  Bus,
  Shirt,
  Package,
  Calendar,
  Eye,
  FolderOpen,
  Lightbulb,
  BookOpen,
  Megaphone,
  Home,
  Smartphone,
  FileText,
  User,
  Clock,
  Shield
} from 'lucide-react';

// Removed legacy INITIAL_DATA block
const Topbar = ({ onMobileMenu, onNavigate }) => {
  const { currentUser, notifications } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  const recentNotifications = notifications?.slice(0, 4) || [];

  return (
    <header className="sticky top-0 z-30 bg-[#F4F7FE]/90 backdrop-blur-xl px-4 py-4 lg:px-8 flex justify-between items-center transition-all border-b border-white/50">
      <div className="flex items-center gap-4">
        <button onClick={onMobileMenu} className="lg:hidden p-2 text-[#042A5B] bg-white rounded-lg shadow-sm border border-gray-100"><Menu size={24} /></button>

        <div className="hidden md:block">
          <h2 className="text-[#1B254B] text-xl font-bold tracking-tight">Cloud Portal</h2>
          <p className="text-[#A3AED0] text-xs font-medium">Internal Employee System v2.0</p>
        </div>
      </div>

      {/* Live Clock - Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
        <Clock size={16} className="text-[#0B4DA2]" />
        <span className="font-bold text-sm text-[#1B254B]">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </span>
        <span className="text-xs text-gray-400">
          {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {(() => {
          const [searchQuery, setSearchQuery] = useState('');
          const [showSearchResults, setShowSearchResults] = useState(false);

          const allSearchableItems = [
            // Employees
            { label: 'Dashboard', id: 'dashboard', roles: ['employee'] },
            { label: 'Projects & Work', id: 'projects', roles: ['employee'] },
            { label: 'Canteen Services', id: 'canteen', roles: ['employee'] },
            { label: 'Guest House Booking', id: 'guest-house', roles: ['employee'] },
            { label: 'Transport Booking', id: 'transport', roles: ['employee'] },
            { label: 'Uniform Request', id: 'uniform', roles: ['employee'] },
            { label: 'SIM Allocation', id: 'sim-allocation', roles: ['employee'] },
            { label: 'Asset Requests', id: 'asset-requests', roles: ['employee'] },
            { label: 'General Request Form', id: 'general-requests', roles: ['employee'] },
            { label: 'Leaves Application', id: 'leaves', roles: ['employee'] },
            { label: 'Gate Pass Application', id: 'gate-pass', roles: ['employee'] },
            { label: 'My Attendance Logs', id: 'my-attendance', roles: ['employee'] },
            { label: 'Payroll & Salary Slips', id: 'payroll', roles: ['employee'] },
            { label: 'Training Programs', id: 'training', roles: ['employee'] },
            { label: 'My Profile', id: 'profile', roles: ['employee'] },
            { label: 'Employee Welfare', id: 'welfare', roles: ['employee'] },
            { label: 'SMG Imagine Submissions', id: 'imagine', roles: ['employee'] },
            { label: 'Company Policies', id: 'policies', roles: ['employee'] },
            { label: 'Company Announcements', id: 'announcements', roles: ['employee'] },

            // Admins
            { label: 'Admin Dashboard', id: 'admin-dashboard', roles: ['admin'] },
            { label: 'View Employee Requests', id: 'admin-requests', roles: ['admin'] },
            { label: 'User Management', id: 'admin-users', roles: ['admin'] },
            { label: 'Attendance HOD View', id: 'admin-attendance', roles: ['admin'] },
            { label: 'Training HOD Management', id: 'admin-training', roles: ['admin'] },
            { label: 'Department Analytics', id: 'admin-analytics', roles: ['admin'] },
            { label: 'Admin Notifications', id: 'admin-notifications', roles: ['admin'] },
            { label: 'Post Announcements', id: 'admin-announcements', roles: ['admin'] },
            { label: 'Project Listing Admin', id: 'admin-projects', roles: ['admin'] },
            { label: 'Production Area Monitor', id: 'admin-production', roles: ['admin'] },
            { label: 'Payroll HOD Admin', id: 'admin-payroll', roles: ['admin'] },
            { label: 'Department Documents', id: 'dept-documents', roles: ['admin'] },

            // Super Admins
            { label: 'Super Admin Dashboard', id: 'super-dashboard', roles: ['superadmin'] },
            { label: 'Super Admin Users', id: 'super-users', roles: ['superadmin'] },
            { label: 'Super Admin Departments', id: 'super-departments', roles: ['superadmin'] },
            { label: 'All Company Requests', id: 'super-requests', roles: ['superadmin'] },
            { label: 'Company Analytics', id: 'super-analytics', roles: ['superadmin'] },
            { label: 'Post Broadcast Announcement', id: 'super-announcements', roles: ['superadmin'] },
            { label: 'Broadcast Notifications', id: 'super-notifications', roles: ['superadmin'] },
            { label: 'System Settings', id: 'super-settings', roles: ['superadmin'] },
            { label: 'Reports & Export', id: 'super-reports', roles: ['superadmin'] }
          ];

          const filteredItems = allSearchableItems.filter(item => {
            const matchesQuery = item.label.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = item.roles.includes(currentUser?.role || 'employee');
            return matchesQuery && matchesRole;
          });

          return (
            <div className="hidden sm:flex items-center bg-white rounded-full px-4 py-2 shadow-sm w-64 border border-transparent hover:border-[#0B4DA2]/30 transition-colors focus-within:border-[#0B4DA2]/50 focus-within:ring-2 focus-within:ring-[#0B4DA2]/10 relative">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search portal..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="bg-transparent border-none outline-none w-full ml-2 text-sm text-[#1B254B] placeholder-gray-400"
              />
              {showSearchResults && searchQuery && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />
                  <div className="absolute left-0 right-0 mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto p-2">
                    {filteredItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setSearchQuery('');
                          setShowSearchResults(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#1B254B] hover:bg-blue-50 hover:text-[#0B4DA2] rounded-xl transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                    {filteredItems.length === 0 && (
                      <div className="text-center py-4 text-xs text-gray-400">No results found</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        <div className="relative">
          <button
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="p-2 text-gray-400 hover:text-[#0B4DA2] bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-[#0B4DA2]/30 active:scale-95 relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#EE5D50] rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationPopup && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotificationPopup(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                  <h3 className="font-bold text-[#1B254B]">Notifications</h3>
                  <span className="text-xs font-bold bg-[#0B4DA2] text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {recentNotifications.length > 0 ? recentNotifications.map((notif: any) => (
                    <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group">
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'success' ? 'bg-[#05CD99]' : notif.type === 'warning' ? 'bg-[#FFB547]' : 'bg-[#0B4DA2]'}`} />
                        <div>
                          <p className="text-sm font-semibold text-[#1B254B] group-hover:text-[#0B4DA2] transition-colors">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-6 text-center text-gray-400">
                      <Bell size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowNotificationPopup(false);
                      const role = currentUser?.role?.toLowerCase();
                      if (role === 'admin') onNavigate('admin-notifications');
                      else if (role === 'superadmin') onNavigate('super-notifications');
                      else onNavigate('notifications');
                    }}
                    className="w-full text-center text-sm font-bold text-[#0B4DA2] hover:bg-blue-50 py-2 rounded-lg transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div onClick={() => onNavigate('profile')} className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-[#0B4DA2]/30 active:scale-95">
          <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'User'}&backgroundColor=b6e3f4`} alt="Profile" className="w-9 h-9 rounded-full border border-gray-200" />
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold text-[#1B254B] leading-tight">{currentUser?.name || 'Guest'}</p>
            <p className="text-[10px] text-gray-400 font-medium">{currentUser?.role || 'Employee'}</p>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </div>
      </div>
    </header>
  );
};

// Admin Sidebar
const AdminSidebar = ({ activePage, onNavigate, onLogout }) => {
  const menuGroups = [
    {
      title: "ADMIN",
      items: [
        { id: 'admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'admin-requests', icon: FileText, label: 'View Requests' },
        { id: 'admin-users', icon: User, label: 'User Management' },
        { id: 'admin-attendance', icon: Calendar, label: 'Attendance Admin' },
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { id: 'admin-training', icon: BookOpen, label: 'Training Management' },
        { id: 'admin-analytics', icon: Settings, label: 'Department Analytics' },
        { id: 'admin-notifications', icon: Bell, label: 'Notifications' },
        { id: 'admin-announcements', icon: Megaphone, label: 'Announcements' },
        { id: 'admin-projects', icon: Briefcase, label: 'Project Listing' },
        { id: 'admin-production', icon: Settings, label: 'Production Area' },
        { id: 'admin-payroll', icon: FileText, label: 'Payroll Admin' }
      ]
    },
    {
      title: "DOCUMENTS",
      items: [
        { id: 'dept-documents', icon: FolderOpen, label: 'Department Documents' }
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex w-[80px] hover:w-[260px] bg-[#042A5B] flex-col h-screen fixed left-0 top-0 z-50 border-r border-[#0B4DA2]/30 transition-all duration-300 group shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-[#0B4DA2]/30 flex items-center gap-3 overflow-hidden whitespace-nowrap shrink-0">
        <div className="w-8 h-8 bg-[#0B4DA2] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shrink-0 text-sm">SMG</div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h2 className="text-white font-bold tracking-wide text-sm">SMG Electric</h2>
          <p className="text-[10px] text-[#87CEEB] tracking-widest font-bold opacity-80">ADMIN PORTAL</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-hide">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-[#87CEEB]/60 uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activePage === item.id
                    ? 'bg-[#0B4DA2] text-white shadow-lg'
                    : 'text-[#87CEEB] hover:bg-[#0B4DA2]/20'
                    }`}
                >
                  <div className="shrink-0 flex justify-center w-6">
                    <item.icon size={20} />
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-bold flex-1 text-left">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#0B4DA2]/30 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#EE5D50] hover:bg-[#EE5D50]/10 transition-all duration-200 font-bold"
        >
          <div className="shrink-0 flex justify-center w-6"><LogOut size={20} /></div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const INITIAL_DATA = {
  user: {
    name: "Rohit Sharma",
    role: "Senior Technician",
    empId: "SMG-2024-042",
    dept: "Assembly",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit&backgroundColor=b6e3f4",
    email: "rohit.sharma@smg-scooters.com",
    shift: "General (9:00 - 18:00)",
    reportingTo: "Priya Sharma",
    phone: "+91 98765 43210",
    emergencyContact: "+91 98765 43211",
    dateOfBirth: "15-Aug-1992",
    dateOfJoining: "10-Jan-2020",
    bloodGroup: "O+",
    address: "Flat 402, Green Valley Apartments, Sector 12, Noida, UP - 201301",
    education: [
      { degree: "B.Tech in Mechanical Engineering", institution: "Delhi Technical University", year: "2010-2014", grade: "8.2 CGPA" },
      { degree: "Senior Secondary (XII)", institution: "DAV Public School", year: "2010", grade: "88%" }
    ],
    certifications: [
      { name: "Six Sigma Green Belt", issuer: "ASQ", year: "2021" },
      { name: "Industrial Safety", issuer: "NSCI", year: "2020" },
      { name: "Quality Management", issuer: "ISO", year: "2019" }
    ],
    skills: ["Assembly Line Operations", "Quality Control", "Safety Compliance", "Technical Documentation", "Team Leadership"],
    languages: ["Hindi (Native)", "English (Fluent)", "Punjabi (Conversational)"]
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'employee' | 'admin' | 'department' | 'superadmin'>('employee');
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'dashboard';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activePage) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activePage]);

  useEffect(() => {
    if (isLoggedIn && userRole !== 'department') {
      window.location.hash = activePage;
    }
  }, [activePage, isLoggedIn, userRole]);

  const handleLogin = (role: 'employee' | 'admin' | 'department' | 'superadmin') => {
    setUserRole(role);
    setIsLoggedIn(true);

    // For department portal, we don't need to set activePage as it renders its own hub
    if (role === 'admin') setActivePage('admin-dashboard');
    else if (role === 'superadmin') setActivePage('super-dashboard');
    else if (role !== 'department') setActivePage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    localStorage.removeItem('employee_user');
    setIsLoggedIn(false);
    setActivePage('dashboard');
    setUserRole('employee');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // If user selected department portal, show the department hub directly
  if (userRole === 'department') {
    return <DepartmentPortalHub />;
  }



  return (
    <AppProvider>
      <AppContent
        userRole={userRole}
        activePage={activePage}
        setActivePage={setActivePage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
      />
    </AppProvider>
  );
}

function AppContent({ userRole, activePage, setActivePage, mobileMenuOpen, setMobileMenuOpen, handleLogout }) {
  const { currentUser } = useApp();
  
  const [basePage, pageId] = (activePage || '').split(':');

  const renderContent = () => {
    switch (basePage) {
      // Main Pages
      case 'dashboard': return <DashboardPage userData={currentUser} onNavigate={setActivePage} />;
      case 'projects': return <ProjectsPage initialSelectedId={pageId} onNavigate={setActivePage} />;
      case 'profile': return <ProfilePage userData={currentUser} />;
      case 'service-catalog': return <DepartmentPortalHub onNavigate={setActivePage} />;

      // Service Catalog Sub-items
      case 'canteen': return <CanteenPage />;
      case 'guest-house': return <GuestHousePage />;
      case 'transport': return <TransportPage />;
      case 'uniform': return <UniformPage />;
      case 'sim-allocation': return <SIMAllocationPage />;
      case 'asset-requests': return <AssetRequestsPage />;
      case 'general-requests': return <GeneralRequestsPage />;

      // Attendance Sub-items
      case 'leaves': return <LeavesPage />;
      case 'my-attendance': return <AttendancePage />;
      case 'gate-pass': return <GatePassPage />;

      // Work & Pay Pages
      case 'payroll': return <PayrollPageOld user={currentUser} />;
      case 'training': return <TrainingPage />;
      case 'documents': return <DocumentsPage />;

      // Personal & Info Pages
      case 'welfare': return <WelfarePage />;
      case 'imagine': return <ImaginePage />;
      case 'policies': return <PoliciesPage />;
      case 'announcements': return <AnnouncementsPage />;
      case 'notifications': return <NotificationsPage />;

      // Admin Pages
      case 'admin-dashboard': return <AdminDashboard onNavigate={setActivePage} />;
      case 'admin-requests': return <AdminRequestsPage onNavigate={setActivePage} />;
      case 'admin-notifications': return <AdminNotificationsPage onNavigate={setActivePage} />;
      case 'admin-users': return <AdminUsersPage />;
      case 'admin-attendance': return <AdminAttendancePage />;
      case 'admin-training': return <AdminTrainingPage />;
      case 'admin-analytics': return <AdminAnalyticsPage />;
      case 'admin-announcements': return <AdminAnnouncementsPage />;
      case 'admin-projects': return <AdminProjectsPage />;
      case 'admin-production': return <AdminProductionPage />;
      case 'admin-payroll': return <AdminPayrollPage />;

      // Super Admin Pages
      case 'super-dashboard': return <SuperAdminDashboard onNavigate={setActivePage} />;
      case 'super-users': return <SuperAdminUsersPage />;
      case 'super-departments': return <SuperAdminDepartmentsPage />;
      case 'super-requests': return <SuperAdminRequestsPage />;
      case 'super-analytics': return <SuperAdminAnalyticsPage />;
      case 'super-announcements': return <SuperAdminAnnouncementsPage />;
      case 'super-notifications': return <SuperAdminNotificationsPage />;
      case 'super-settings': return <SuperAdminSettingsPage />;
      case 'super-reports': return <SuperAdminReportsPage />;

      default: return (<div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 animate-in fade-in"><Settings size={64} className="mb-4 text-[#0B4DA2] opacity-20" /><h2 className="text-xl font-bold text-[#1B254B]">Page Under Construction</h2><p className="text-sm text-[#A3AED0] mt-2">This page is being developed</p></div>);
    }
  };

  return (
    <div className="bg-[#F4F7FE] min-h-screen font-sans text-[#1B254B] selection:bg-[#0B4DA2] selection:text-white">
      {userRole === 'admin' ? (
        <AdminSidebar activePage={basePage} onNavigate={setActivePage} onLogout={handleLogout} />
      ) : userRole === 'superadmin' ? (
        <SuperAdminSidebar activePage={basePage} onNavigate={setActivePage} onLogout={handleLogout} />
      ) : (
        <Sidebar activePage={basePage} onNavigate={setActivePage} onLogout={handleLogout} />
      )}
      <div className="lg:ml-[80px] min-h-screen flex flex-col transition-all duration-300">
        <Topbar onMobileMenu={() => setMobileMenuOpen(true)} onNavigate={setActivePage} />
        <main className="p-4 lg:px-8 2xl:px-12 py-6 w-full max-w-[1800px] mx-auto pb-24 lg:pb-8">{renderContent()}</main>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[#1B254B]/60 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col p-6 animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-[#1B254B]">SMG Portal</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2 overflow-y-auto">
              {(() => {
                const getMobileMenuItems = (role) => {
                  if (role === 'superadmin') {
                    return [
                      { id: 'super-dashboard', label: 'Super Dashboard', icon: LayoutDashboard },
                      { id: 'super-users', label: 'User Management', icon: User },
                      { id: 'super-departments', label: 'Departments', icon: Home },
                      { id: 'super-requests', label: 'All Requests', icon: FileText },
                      { id: 'super-analytics', label: 'Analytics', icon: Settings },
                      { id: 'super-announcements', label: 'Announcements', icon: Megaphone },
                      { id: 'super-notifications', label: 'Broadcast Notifications', icon: Bell },
                      { id: 'super-settings', label: 'System Settings', icon: Settings },
                      { id: 'super-reports', label: 'Reports & Export', icon: FolderOpen }
                    ];
                  } else if (role === 'admin') {
                    return [
                      { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
                      { id: 'admin-requests', label: 'View Requests', icon: FileText },
                      { id: 'admin-users', label: 'User Management', icon: User },
                      { id: 'admin-attendance', label: 'Attendance Admin', icon: Calendar },
                      { id: 'admin-training', label: 'Training Management', icon: BookOpen },
                      { id: 'admin-analytics', label: 'Department Analytics', icon: Settings },
                      { id: 'admin-notifications', label: 'Notifications', icon: Bell },
                      { id: 'admin-announcements', label: 'Announcements', icon: Megaphone },
                      { id: 'admin-projects', label: 'Project Listing', icon: Briefcase },
                      { id: 'admin-production', label: 'Production Area', icon: Settings },
                      { id: 'admin-payroll', label: 'Payroll Admin', icon: FileText }
                    ];
                  } else {
                    return [
                      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                      { id: 'projects', label: 'Projects & Work', icon: Briefcase },
                      { id: 'canteen', label: 'Canteen', icon: Coffee },
                      { id: 'guest-house', label: 'Guest House', icon: Home },
                      { id: 'transport', label: 'Transport', icon: Bus },
                      { id: 'uniform', label: 'Uniform Requests', icon: Shirt },
                      { id: 'sim-allocation', label: 'SIM Allocation', icon: Smartphone },
                      { id: 'asset-requests', label: 'Asset Requests', icon: Package },
                      { id: 'general-requests', label: 'General Requests', icon: FileText },
                      { id: 'leaves', label: 'Leaves', icon: Calendar },
                      { id: 'gate-pass', label: 'Gate Pass', icon: Shield },
                      { id: 'my-attendance', label: 'My Attendance', icon: Eye },
                      { id: 'payroll', label: 'Payroll & Salary', icon: FileText },
                      { id: 'training', label: 'Training', icon: BookOpen },
                      { id: 'profile', label: 'My Profile', icon: User },
                      { id: 'welfare', label: 'Employee Welfare', icon: Heart },
                      { id: 'imagine', label: 'SMG Imagine', icon: Lightbulb },
                      { id: 'policies', label: 'Company Policies', icon: BookOpen },
                      { id: 'announcements', label: 'Announcements', icon: Megaphone }
                    ];
                  }
                };
                return getMobileMenuItems(userRole).map(item => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${activePage === item.id ? 'bg-[#0B4DA2] text-white' : 'text-gray-500 hover:bg-[#F4F7FE]'}`}
                    onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }}
                  >
                    <item.icon size={20} />{item.label}
                  </button>
                ));
              })()}
            </nav>
            <div className="mt-auto pt-6 border-t border-gray-100">
              <button onClick={handleLogout} className="flex items-center gap-2 text-[#EE5D50] font-bold w-full p-2 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Sidebar = ({ activePage, onNavigate, onLogout }) => {
  const [openDropdowns, setOpenDropdowns] = useState(['service-catalog', 'attendance']);

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const menuGroups = [
    {
      title: "Main",
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'projects', icon: Briefcase, label: 'Projects & Work' },
        {
          id: 'service-catalog',
          icon: ShoppingBag,
          label: 'Service Catalog',
          hasDropdown: true,
          subItems: [
            { id: 'canteen', icon: Coffee, label: 'Canteen' },
            { id: 'guest-house', icon: Home, label: 'Guest House' },
            { id: 'transport', icon: Bus, label: 'Transport' },
            { id: 'uniform', icon: Shirt, label: 'Uniform' },
            { id: 'sim-allocation', icon: Smartphone, label: 'SIM Allocation' },
            { id: 'asset-requests', icon: Package, label: 'Asset Requests' },
            { id: 'general-requests', icon: FileText, label: 'General Requests' }
          ]
        },
        {
          id: 'attendance',
          icon: Calendar,
          label: 'Attendance',
          hasDropdown: true,
          subItems: [
            { id: 'leaves', icon: Calendar, label: 'Leaves' },
            { id: 'gate-pass', icon: Shield, label: 'Gate Pass' },
            { id: 'my-attendance', icon: Eye, label: 'My Attendance View' }
          ]
        }
      ]
    },
    {
      title: "Work & Pay",
      items: [
        { id: 'payroll', icon: FileText, label: 'Payroll & Salary' },
        { id: 'training', icon: BookOpen, label: 'Training' }
      ]
    },
    {
      title: "Personal & Info",
      items: [
        { id: 'profile', icon: User, label: 'My Profile' },
        { id: 'welfare', icon: Heart, label: 'Employee Welfare' },
        { id: 'imagine', icon: Lightbulb, label: 'SMG Imagine' },
        { id: 'policies', icon: BookOpen, label: 'Company Policies' },
        { id: 'announcements', icon: Megaphone, label: 'Announcements' }
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex w-[80px] hover:w-[260px] bg-[#042A5B] flex-col h-screen fixed left-0 top-0 z-50 border-r border-[#0B4DA2]/30 transition-all duration-300 group shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-[#0B4DA2]/30 flex items-center gap-3 overflow-hidden whitespace-nowrap shrink-0">
        <div className="w-8 h-8 bg-[#0B4DA2] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shrink-0 text-sm">SMG</div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h2 className="text-white font-bold tracking-wide text-sm">SMG Electric</h2>
          <p className="text-[10px] text-[#87CEEB] tracking-widest font-bold opacity-80">EMPLOYEE PORTAL</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-hide">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-[#87CEEB]/60 uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <div key={item.id}>
                  {/* Main menu item */}
                  <button
                    onClick={() => item.hasDropdown ? toggleDropdown(item.id) : onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activePage === item.id
                      ? 'bg-[#0B4DA2] text-white shadow-lg'
                      : 'text-[#87CEEB] hover:bg-[#0B4DA2]/20'
                      }`}
                  >
                    <div className="shrink-0 flex justify-center w-6">
                      <item.icon size={20} />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-bold flex-1 text-left">
                      {item.label}
                    </span>
                    {item.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${openDropdowns.includes(item.id) ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </button>

                  {/* Sub-items */}
                  {item.hasDropdown && openDropdowns.includes(item.id) && (
                    <div className="ml-9 mt-1 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onNavigate(subItem.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activePage === subItem.id
                            ? 'bg-[#0B4DA2]/50 text-white font-bold'
                            : 'text-[#87CEEB]/80 hover:bg-[#0B4DA2]/10 hover:text-[#87CEEB]'
                            }`}
                        >
                          <subItem.icon size={16} />
                          <span className="whitespace-nowrap">{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#0B4DA2]/30 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#EE5D50] hover:bg-[#EE5D50]/10 transition-all duration-200 font-bold"
        >
          <div className="shrink-0 flex justify-center w-6"><LogOut size={20} /></div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
