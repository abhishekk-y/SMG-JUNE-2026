// HR Portal - Complete with premium Dribbble-inspired UX/UI theme
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  IndianRupee,
  Clock,
  Calendar,
  LogOut,
  Search,
  Bell,
  Check,
  X,
  FileText,
  ChevronRight,
  Plus,
  Upload,
  UserCheck,
  DollarSign,
  Briefcase,
  Sliders,
  AlertCircle,
  TrendingUp,
  Percent,
  CheckCircle2,
  Filter,
  UserX,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  CornerDownRight,
  Sparkles,
  Info
} from 'lucide-react';
import { parseResume, createEmployee, getUsers, getAdminRequests, getTrainings, getAnnouncements, updateUser, approveRequest, rejectRequest } from '../../services/api';

// ============ HOOKS ============
function useDataStore(key: string) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (key === 'hr:users') res = await getUsers();
            else if (key === 'hr:requests') res = await getAdminRequests();
            else if (key === 'hr:trainings') res = await getTrainings();
            else if (key === 'hr:announcements') res = await getAnnouncements();
            
            if (res) {
                if (key === 'hr:users') {
                    setData(res.map((u: any) => ({
                        id: u.empId || u._id,
                        _id: u._id,
                        name: u.name,
                        dept: u.dept,
                        role: u.role,
                        designation: u.designation || 'Associate Specialist',
                        contact: u.phone || '-',
                        salary: Number(u.salary) || 450000,
                        status: u.isActive ? 'Active' : 'Inactive',
                        dateOfJoining: u.dateOfJoining || '12.03.2022',
                        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=b6e3f4`
                    })));
                } else if (key === 'hr:requests') {
                     setData(res.map((r: any) => ({
                         id: r._id,
                         type: r.type,
                         employee: r.user?.name || 'Unknown User',
                         empId: r.user?.empId || '-',
                         date: new Date(r.createdAt).toLocaleDateString('en-IN'),
                         days: r.duration || 1,
                         status: r.status,
                         reason: r.reason || r.description || '-',
                         avatar: r.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.user?.name || 'U')}&backgroundColor=b6e3f4`
                     })));
                } else if (key === 'hr:trainings') {
                    setData(res.map((t: any) => ({
                        id: t._id,
                        name: t.title,
                        trainer: t.instructor || 'Internal',
                        date: new Date(t.date || t.createdAt).toLocaleDateString('en-IN'),
                        participants: (t.enrolledUsers || []).length,
                        status: 'Scheduled',
                        description: t.description || 'Professional workforce development seminar'
                    })));
                } else if (key === 'hr:announcements') {
                    setData(res.map((a: any) => ({
                        id: a._id,
                        title: a.title,
                        date: new Date(a.date || a.createdAt).toLocaleDateString('en-IN'),
                        content: a.content || a.message
                    })));
                }
            }
        } catch (err) { console.error('Failed to fetch', key, err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            fetchData();
        }
        return () => { mounted = false; };
    }, [key]);

    const api = useMemo(() => ({
        async add(item: any) {
            setData((prev: any[]) => [item, ...prev]);
            return item;
        },
        async update(matchFn: (it: any) => boolean, updater: (it: any) => any) {
            setData((prev: any[]) => prev.map(it => (matchFn(it) ? { ...it, ...updater(it) } : it)));
        },
        async remove(matchFn: (it: any) => boolean) {
            setData((prev: any[]) => prev.filter(it => !matchFn(it)));
        },
        refresh: fetchData
    }), []);

    return { data, setData, api, loading };
}

function useSearch(source: any[], fields: string[], query: string) {
    return useMemo(() => {
        if (!query) return source;
        const q = query.toLowerCase();
        return source.filter(item =>
            fields.some(f => String(item[f] ?? '').toLowerCase().includes(q))
        );
    }, [source, fields, query]);
}

// ============ COMPONENTS ============
function Topbar({ activeTab, query, setQuery }: { activeTab: string; query: string; setQuery: (q: string) => void }) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const dateStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayStr = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: '2-digit' });

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Dashboard Overview';
            case 'users': return 'Employee Directory';
            case 'requests': return 'Approvals & Requests';
            case 'attendance': return 'Attendance Records';
            case 'training': return 'Workforce Training';
            case 'salary': return 'Compensation Revision';
            case 'analytics': return 'Performance & Headcount';
            case 'announcements': return 'Internal Announcements';
            default: return 'HR Portal';
        }
    };

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
            <div>
                <h1 className="text-xl font-bold text-gray-900">{getTitle()}</h1>
                <p className="text-xs text-gray-500 mt-0.5">{dayStr} · {dateStr}</p>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="relative w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-gray-50 text-sm border-0 rounded-xl pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-[#0B4DA2] focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                    />
                </div>
                
                <button className="relative p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-gray-600">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B4DA2] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-200">
                        HR
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-800 leading-tight">Anya Sharma</div>
                        <div className="text-[11px] font-medium text-gray-400">HR Manager</div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Sidebar({ activeTab, onTabChange, onLogout }: { activeTab: string; onTabChange: (tab: string) => void; onLogout: () => void }) {
    const menuItems = [
        { id: 'dashboard', label: 'Home', icon: Users },
        { id: 'users', label: 'Employee Directory', icon: Briefcase },
        { id: 'salary', label: 'Salary Revision', icon: IndianRupee },
        { id: 'requests', label: 'View Requests', icon: FileText },
        { id: 'attendance', label: 'Attendance Admin', icon: Clock },
        { id: 'training', label: 'Trainings Hub', icon: Calendar },
        { id: 'announcements', label: 'Announcements', icon: Bell },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 z-40 border-r border-slate-800 shadow-xl">
            {/* Brand Header */}
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
                    P
                </div>
                <div>
                    <h2 className="text-base font-bold text-white tracking-tight leading-none">PulseTech</h2>
                    <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">HR System</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-3 block mb-3">Core Hub</span>
                {menuItems.slice(0, 3).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all ${
                                isActive 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            {item.label}
                        </button>
                    );
                })}

                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-3 block mt-6 mb-3">Approvals & Comms</span>
                {menuItems.slice(3).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all ${
                                isActive 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* User Account / Logout */}
            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={onLogout} 
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-400 rounded-xl text-sm font-semibold transition-all border border-slate-700/50"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

// Dialog Modal using Tailwind CSS
function CustomModal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 relative z-10 overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-base font-bold text-gray-900">{title}</h3>
                            <button onClick={onClose} className="p-1.5 hover:bg-gray-150 rounded-xl text-gray-400 hover:text-gray-600 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ============ PORTAL VIEWS ============

// 1. Dashboard View
function DashboardView({ onTabChange }: { onTabChange: (tab: string) => void }) {
    const { data: users, loading: usersLoading } = useDataStore('hr:users');
    const { data: requests } = useDataStore('hr:requests');

    const pendingRequestsCount = useMemo(() => requests.filter((r: any) => r.status === 'Pending').length, [requests]);
    
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter((u: any) => u.status === 'Active').length;
        const totalPayroll = users.reduce((acc, u) => acc + (u.salary || 0), 0);
        return { total, active, totalPayroll };
    }, [users]);

    return (
        <div className="space-y-8">
            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div 
                    onClick={() => onTabChange('users')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150/80 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-36"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Employees</span>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">{usersLoading ? '...' : stats.total}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-[#0B4DA2]">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">Active directory registry</span>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150/80 flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Status</span>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">{usersLoading ? '...' : stats.active}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>
                    <span className="text-xs text-green-500 font-semibold">↑ 98.2% Active ratio</span>
                </div>

                <div 
                    onClick={() => onTabChange('requests')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150/80 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-36"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Approvals</span>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">{pendingRequestsCount}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                    <span className="text-xs text-amber-500 font-semibold">Needs attention</span>
                </div>

                <div 
                    onClick={() => onTabChange('salary')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150/80 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-36"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Annual CTC</span>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">₹{(stats.totalPayroll / 100000).toFixed(1)}L</h3>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl text-slate-800">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">Total payroll budget</span>
                </div>
            </div>

            {/* Quick Actions & Recent Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-gray-900">Recent Employee Onboarding</h4>
                    {usersLoading ? (
                        <div className="py-12 flex items-center justify-center text-sm text-gray-400">Loading directory...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {users.slice(0, 4).map((u: any) => (
                                <div key={u.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800">{u.name}</div>
                                            <div className="text-xs text-gray-500 font-medium">{u.dept} · {u.designation}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-blue-600">{u.id}</div>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-50 text-green-700 mt-1 inline-block">Active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Onboarding Actions</h4>
                        <p className="text-xs text-gray-500 leading-normal">
                            Register new employees into the SMG secure database. AI resume parsing parses profile data instantly.
                        </p>
                    </div>
                    <div className="space-y-3 mt-6">
                        <button 
                            onClick={() => onTabChange('users')}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0B4DA2] hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-100"
                        >
                            <Plus className="w-4 h-4" /> Add Employee Record
                        </button>
                        <button 
                            onClick={() => onTabChange('salary')}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl transition-all border border-gray-250/50"
                        >
                            <Sliders className="w-4 h-4" /> Review Compensations
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 2. User Directory Management View
function UserManagementView() {
    const { data, api, loading } = useDataStore('hr:users');
    const [query, setQuery] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const filtered = useSearch(data, ['name', 'dept', 'role', 'status', 'id'], query);

    const [formState, setFormState] = useState({ name: '', email: '', dept: '', role: '', contact: '', salary: '', designation: '' });

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const res = await parseResume(formData);
            if (res.success && res.data) {
                setFormState(prev => ({
                    ...prev,
                    name: res.data.name || prev.name,
                    email: res.data.email || prev.email,
                    dept: res.data.suggestedDepartment || prev.dept,
                    designation: res.data.suggestedRole || prev.designation,
                    contact: res.data.phone || prev.contact
                }));
            }
        } catch (err) {
            alert('Failed to parse resume');
        } finally {
            setIsParsing(false);
        }
    };

    const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, dept, role, contact, salary, designation } = formState;
        if (!name || !email || !dept) {
            alert('Name, Email, and Department are required.');
            return;
        }
        
        try {
            const newDbUser = await createEmployee({
                name, email, dept, role: role || 'employee', phone: contact, salary, designation
            });
            
            await api.refresh();
            setCreateOpen(false);
            setFormState({ name: '', email: '', dept: '', role: '', contact: '', salary: '', designation: '' });
            alert(`Success! Account created for ${name}. Email dispatched with temporary credentials.`);
        } catch (err: any) {
            alert(`Failed to create employee: ${err.message}`);
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            const user = data.find((u: any) => u.id === id);
            if (user && user._id) {
                const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
                await updateUser(user._id, { isActive: newStatus === 'Active' });
                await api.update((u: any) => u.id === id, (u: any) => ({ status: newStatus }));
            }
        } catch (e) { alert('Failed to update status'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input 
                        placeholder="Search employee registry..." 
                        value={query} 
                        onChange={e => setQuery(e.target.value)} 
                        className="w-full bg-white text-sm border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                    />
                </div>
                <button 
                    onClick={() => setCreateOpen(true)} 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0B4DA2] hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-150/40"
                >
                    <Plus className="w-4 h-4" /> Add Employee
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-24 text-center text-sm text-gray-400 font-medium">Loading database...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 tracking-wider">
                                    <th className="p-4 pl-6">Employee ID</th>
                                    <th className="p-4">Profile Details</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Designation</th>
                                    <th className="p-4">Annual Salary</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center pr-6">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="p-4 pl-6 text-sm font-bold text-blue-600 tracking-tight">{u.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{u.name}</div>
                                                    <div className="text-xs text-gray-400 font-medium">{u.contact}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-gray-700">{u.dept}</td>
                                        <td className="p-4 text-sm font-semibold text-gray-700">{u.designation}</td>
                                        <td className="p-4 text-sm font-bold text-gray-950">₹{Number(u.salary).toLocaleString('en-IN')}</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                                u.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center pr-6">
                                            <button 
                                                onClick={() => toggleStatus(u.id)} 
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                                                    u.status === 'Active' 
                                                        ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                                                        : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                                }`}
                                            >
                                                {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <CustomModal open={createOpen} title="Onboard New Employee" onClose={() => setCreateOpen(false)}>
                {/* AI Resume Upload Section */}
                <div className="mb-6 p-4 bg-blue-50/50 border border-blue-200/50 rounded-2xl flex items-center justify-between">
                    <div>
                        <div className="text-xs font-extrabold text-[#0B4DA2] flex items-center gap-1.5 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Resume Auto-Fill
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">Upload candidate profile CV to auto-fill details.</p>
                    </div>
                    <label className="flex items-center gap-1.5 bg-[#0B4DA2] hover:bg-blue-700 text-white px-3 py-2 rounded-xl cursor-pointer text-xs font-bold transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        {isParsing ? 'Parsing...' : 'Upload CV'}
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    </label>
                </div>

                <form onSubmit={onCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
                            <input value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} placeholder="e.g. Rahul Singh" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address *</label>
                            <input value={formState.email} type="email" onChange={e => setFormState({...formState, email: e.target.value})} placeholder="Rahul@smg.com" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Department *</label>
                            <input value={formState.dept} onChange={e => setFormState({...formState, dept: e.target.value})} placeholder="e.g. Assembly" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Designation</label>
                            <input value={formState.designation} onChange={e => setFormState({...formState, designation: e.target.value})} placeholder="e.g. Technician II" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Contact Number</label>
                            <input value={formState.contact} onChange={e => setFormState({...formState, contact: e.target.value})} placeholder="+91 9988776655" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Proposed Annual Salary (CTC)</label>
                            <input value={formState.salary} onChange={e => setFormState({...formState, salary: e.target.value})} placeholder="e.g. 5,00,000" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#0B4DA2] hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all">Save Employee</button>
                    </div>
                </form>
            </CustomModal>
        </div>
    );
}

// 3. Compensation & Salary Revision View (Dribbble Layout)
function SalaryRevisionView() {
    const { data: users, api: usersApi, loading: usersLoading } = useDataStore('hr:users');
    const [revisedSalaries, setRevisedSalaries] = useState<Record<string, number>>({});
    const [revisedPercentages, setRevisedPercentages] = useState<Record<string, number>>({});
    const [inputModes, setInputModes] = useState<Record<string, 'currency' | 'percent'>>({});
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedForms, setSelectedForms] = useState<Record<string, boolean>>({ '022': true });

    // Initialize state values when users data load
    useEffect(() => {
        if (users.length && Object.keys(revisedSalaries).length === 0) {
            const initialSals: Record<string, number> = {};
            const initialPct: Record<string, number> = {};
            users.forEach(u => {
                initialSals[u.id] = u.salary;
                initialPct[u.id] = 20; // Default 20% revision recommendation
            });
            setRevisedSalaries(initialSals);
            setRevisedPercentages(initialPct);
        }
    }, [users]);

    // Live Metrics Calculations based on screenshot
    const metrics = useMemo(() => {
        let totalOriginalBudget = 0;
        let totalBudgetAfterRevision = 0;

        users.forEach(u => {
            totalOriginalBudget += u.salary;
            totalBudgetAfterRevision += revisedSalaries[u.id] ?? u.salary;
        });

        const deviation = totalBudgetAfterRevision - totalOriginalBudget;
        const deviationPct = totalOriginalBudget > 0 ? (deviation / totalOriginalBudget) * 100 : 0;
        
        // Let's set a baseline budget allocation pool (e.g. ₹1.5 Crore)
        const totalBudgetPool = 15000000;
        const unallocatedBalance = totalBudgetPool - totalBudgetAfterRevision;

        return {
            budgetAfterRevision: totalBudgetAfterRevision,
            allocatedBudget: totalOriginalBudget,
            deviation,
            deviationPct,
            unallocatedBalance
        };
    }, [users, revisedSalaries]);

    const handleSalaryChange = (id: string, originalSalary: number, valStr: string) => {
        const val = parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
        setRevisedSalaries(prev => ({ ...prev, [id]: val }));
        
        // Auto compute percent change
        if (originalSalary > 0) {
            const diffPct = Math.round(((val - originalSalary) / originalSalary) * 100);
            setRevisedPercentages(prev => ({ ...prev, [id]: diffPct }));
        }
    };

    const handlePercentChange = (id: string, originalSalary: number, valStr: string) => {
        const pct = parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
        setRevisedPercentages(prev => ({ ...prev, [id]: pct }));
        
        // Auto compute revised salary
        const revisedVal = Math.round(originalSalary * (1 + pct / 100));
        setRevisedSalaries(prev => ({ ...prev, [id]: revisedVal }));
    };

    const toggleInputMode = (id: string) => {
        setInputModes(prev => ({
            ...prev,
            [id]: prev[id] === 'percent' ? 'currency' : 'percent'
        }));
    };

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDownloadExcel = () => {
        alert('Downloading salary revision spreadsheet report...');
    };

    const handleSendForm = async () => {
        // Apply updates to the database!
        try {
            let successCount = 0;
            for (const u of users) {
                const newSal = revisedSalaries[u.id];
                if (newSal !== undefined && newSal !== u.salary) {
                    await updateUser(u._id, { salary: newSal });
                    successCount++;
                }
            }
            await usersApi.refresh();
            alert(`Revisions applied successfully! Updated ${successCount} employee salaries in the central database.`);
        } catch (e: any) {
            alert(`Error updating salaries: ${e.message}`);
        }
    };

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const q = searchQuery.toLowerCase();
        return users.filter(u => 
            u.name.toLowerCase().includes(q) || 
            u.dept.toLowerCase().includes(q) || 
            u.designation.toLowerCase().includes(q)
        );
    }, [users, searchQuery]);

    return (
        <div className="space-y-6">
            {/* Header Title with Excel Action */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Salary revision</h2>
                <button 
                    onClick={handleDownloadExcel}
                    className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Download Excel
                </button>
            </div>

            {/* Dribbble metrics cards header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-gray-200/60 rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden bg-white">
                <div className="bg-white p-6">
                    <h4 className="text-[32px] font-bold text-gray-900 tracking-tight">₹{metrics.budgetAfterRevision.toLocaleString('en-IN')}</h4>
                    <span className="text-xs font-semibold text-gray-400 mt-1 block">Budget after revision</span>
                </div>
                <div className="bg-white p-6">
                    <h4 className="text-[32px] font-bold text-gray-900 tracking-tight">₹{metrics.allocatedBudget.toLocaleString('en-IN')}</h4>
                    <span className="text-xs font-semibold text-gray-400 mt-1 block">Actual allocated budget</span>
                </div>
                <div className="bg-white p-6">
                    <h4 className={`text-[32px] font-bold tracking-tight ${metrics.deviation >= 0 ? 'text-rose-500' : 'text-green-600'}`}>
                        {metrics.deviation >= 0 ? '+' : ''}₹{metrics.deviation.toLocaleString('en-IN')}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-gray-400">Deviation</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            metrics.deviation >= 0 ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-600'
                        }`}>
                            {metrics.deviation >= 0 ? '+' : ''}{metrics.deviationPct.toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6">
                    <h4 className="text-[32px] font-bold text-gray-900 tracking-tight">₹{metrics.unallocatedBalance.toLocaleString('en-IN')}</h4>
                    <span className="text-xs font-semibold text-gray-400 mt-1 block">Unallocated balance</span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input 
                        placeholder="Search employees..." 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                        className="w-full bg-white text-sm border border-gray-200 rounded-xl pl-9 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm rounded-xl transition-all shadow-sm">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* Select All and Actions header */}
            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-150/60">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked />
                    Select all forms on a page
                </label>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Form selected: 1</span>
                    <button className="px-4 py-2 border border-gray-250/80 bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-xl shadow-sm">Return</button>
                    <button onClick={handleSendForm} className="px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm">Send Form</button>
                </div>
            </div>

            {/* Revision Form Accordion list */}
            <div className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4.5 h-4.5 rounded text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked />
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-gray-900">Revision Form No. 022</h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">In Work</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 font-semibold">Head: Anya Sharma</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200/50 bg-blue-50/40 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-50 transition-all">
                        <CornerDownRight className="w-3.5 h-3.5" /> Coordination route
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {usersLoading ? (
                        <div className="py-24 text-center text-sm text-gray-400 font-medium">Fetching details...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/10 border-b border-gray-100 text-xs font-bold text-gray-500 tracking-wider">
                                    <th className="p-4 pl-6 w-12"></th>
                                    <th className="p-4">Employee</th>
                                    <th className="p-4 text-center">Current salary</th>
                                    <th className="p-4 text-center">Rec.% revision</th>
                                    <th className="p-4 text-center">Rec. salary</th>
                                    <th className="p-4 text-center">New salary</th>
                                    <th className="p-4 text-right pr-6">Salary after</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((u: any) => {
                                    const origSal = u.salary;
                                    const revisedSal = revisedSalaries[u.id] ?? origSal;
                                    const recPct = revisedPercentages[u.id] ?? 20;
                                    const recSal = Math.round(origSal * (1 + recPct / 100));
                                    const isExpanded = !!expandedRows[u.id];
                                    const isPercent = inputModes[u.id] === 'percent';

                                    // Proportional timeline limits for slider calculations
                                    const devLimit = Math.round(origSal * 0.75);
                                    const stdLimit = Math.round(origSal * 0.95);
                                    const expLimit = Math.round(origSal * 1.15);
                                    const maxLimit = Math.round(origSal * 1.35);

                                    // Helper to calculate percentages on the timeline track
                                    const getPctOnTrack = (val: number) => {
                                        if (val <= devLimit) return 0;
                                        if (val >= maxLimit) return 100;
                                        return ((val - devLimit) / (maxLimit - devLimit)) * 100;
                                    };

                                    return (
                                        <>
                                            <tr key={u.id} className={`hover:bg-gray-50/30 transition-colors ${isExpanded ? 'bg-blue-50/10' : ''}`}>
                                                <td className="p-4 pl-6 text-center">
                                                    <div className="flex items-center gap-3">
                                                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked />
                                                        <button onClick={() => toggleRow(u.id)} className="p-1 hover:bg-gray-150 rounded text-gray-500">
                                                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover border border-gray-100" />
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{u.name}</div>
                                                            <div className="text-xs text-gray-400 font-semibold">{u.designation}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center text-sm font-semibold text-gray-600">₹{origSal.toLocaleString('en-IN')}</td>
                                                <td className="p-4 text-center text-sm font-bold text-gray-900">+{recPct}%</td>
                                                <td className="p-4 text-center text-sm font-semibold text-gray-600">₹{recSal.toLocaleString('en-IN')}</td>
                                                <td className="p-4 text-center">
                                                    <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                                                        <input 
                                                            type="text"
                                                            value={isPercent ? recPct : revisedSal}
                                                            onChange={e => isPercent 
                                                                ? handlePercentChange(u.id, origSal, e.target.value)
                                                                : handleSalaryChange(u.id, origSal, e.target.value)
                                                            }
                                                            placeholder={isPercent ? "20%" : "Set new salary"}
                                                            className="w-28 px-3 py-1.5 bg-transparent border-0 text-xs font-bold text-gray-700 focus:ring-0 placeholder-gray-400 outline-none"
                                                        />
                                                        <button 
                                                            onClick={() => toggleInputMode(u.id)}
                                                            className="px-2 py-1.5 text-[10px] font-black border-l border-gray-200 hover:bg-gray-150 text-gray-500 bg-gray-100/60 uppercase tracking-widest"
                                                        >
                                                            {isPercent ? '%' : '₹'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right pr-6 text-sm font-black text-gray-900">
                                                    ₹{revisedSal.toLocaleString('en-IN')}
                                                </td>
                                            </tr>

                                            {/* Expanded row with details and range timeline */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={7} className="bg-slate-50/50 p-6 border-b border-gray-100">
                                                        <div className="space-y-6 max-w-5xl mx-auto">
                                                            {/* Basics details */}
                                                            <div>
                                                                <h5 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-3">Basics</h5>
                                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-400 font-semibold block">Beginning of work</span>
                                                                        <span className="text-xs font-bold text-gray-700 mt-1 block">{u.dateOfJoining}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-400 font-semibold block">Last salary change</span>
                                                                        <span className="text-xs font-bold text-gray-700 mt-1 block">15.04.2023</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-400 font-semibold block">Schedule</span>
                                                                        <span className="text-xs font-bold text-gray-700 mt-1 block">5/2</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-400 font-semibold block">Annual bonus</span>
                                                                        <span className="text-xs font-bold text-gray-700 mt-1 block">20%</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-400 font-semibold block">Performance</span>
                                                                        <span className="text-xs font-bold text-blue-700 mt-1 block flex items-center gap-1">
                                                                            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Exceeds Standards
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Salary Range timeline */}
                                                            <div className="pt-4 border-t border-gray-200/60">
                                                                <div className="flex justify-between items-center mb-6">
                                                                    <h5 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Salary Range</h5>
                                                                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                                                                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Current</span>
                                                                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Recommended</span>
                                                                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span> Benchmark</span>
                                                                    </div>
                                                                </div>

                                                                {/* Custom CSS Timeline slider track */}
                                                                <div className="relative pt-6 pb-4 px-2">
                                                                    {/* Track bar */}
                                                                    <div className="h-1.5 bg-gray-200 rounded-full w-full relative">
                                                                        {/* Indicator pins */}
                                                                        {/* 1. Current pin (Yellow) */}
                                                                        <div 
                                                                            className="absolute -top-2 w-5.5 h-5.5 rounded-full bg-white border-4 border-amber-400 shadow-sm flex items-center justify-center -translate-x-1/2 cursor-pointer z-10 hover:scale-110 transition-transform"
                                                                            style={{ left: `${getPctOnTrack(origSal)}%` }}
                                                                            title={`Current CTC: ₹${origSal.toLocaleString('en-IN')}`}
                                                                        >
                                                                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                                                                        </div>

                                                                        {/* 2. Recommended pin (Green) */}
                                                                        <div 
                                                                            className="absolute -top-2 w-5.5 h-5.5 rounded-full bg-white border-4 border-green-500 shadow-sm flex items-center justify-center -translate-x-1/2 cursor-pointer z-10 hover:scale-110 transition-transform"
                                                                            style={{ left: `${getPctOnTrack(recSal)}%` }}
                                                                            title={`Recommended CTC: ₹${recSal.toLocaleString('en-IN')}`}
                                                                        >
                                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                                        </div>

                                                                        {/* 3. Benchmark pin (Purple) */}
                                                                        <div 
                                                                            className="absolute -top-2 w-5.5 h-5.5 rounded-full bg-white border-4 border-purple-600 shadow-sm flex items-center justify-center -translate-x-1/2 cursor-pointer z-10 hover:scale-110 transition-transform"
                                                                            style={{ left: `${getPctOnTrack(Math.round(origSal * 1.1))}%` }}
                                                                            title={`Benchmark CTC: ₹${Math.round(origSal * 1.1).toLocaleString('en-IN')}`}
                                                                        >
                                                                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Milestones labels */}
                                                                    <div className="flex justify-between mt-5 text-[11px] font-bold text-gray-400">
                                                                        <div className="text-left">
                                                                            <span className="block text-gray-500">Development</span>
                                                                            <span className="block text-gray-400 font-semibold mt-0.5">₹{devLimit.toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <span className="block text-gray-500">Standard</span>
                                                                            <span className="block text-gray-400 font-semibold mt-0.5">₹{stdLimit.toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <span className="block text-gray-500">Experience</span>
                                                                            <span className="block text-gray-400 font-semibold mt-0.5">₹{expLimit.toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="block text-gray-500">Expert</span>
                                                                            <span className="block text-gray-400 font-semibold mt-0.5">₹{maxLimit.toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

// 4. View Requests & Approvals
function RequestsView() {
    const { data, api, loading } = useDataStore('hr:requests');

    const approve = async (id: string) => {
        try {
            await approveRequest(id);
            await api.update((r: any) => r.id === id, () => ({ status: 'Approved' }));
        } catch (e) { alert('Failed to approve request'); }
    };
    const reject = async (id: string) => {
        try {
            await rejectRequest(id, 'Rejected by HR');
            await api.update((r: any) => r.id === id, () => ({ status: 'Rejected' }));
        } catch (e) { alert('Failed to reject request'); }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
                    <h4 className="text-sm font-bold text-gray-900">Leaves & Clearance Requests</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Manage employee-submitted workflow approvals.</p>
                </div>

                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="py-24 text-center text-sm text-gray-400 font-medium">Fetching requests logs...</div>
                    ) : data.length === 0 ? (
                        <div className="py-24 text-center text-sm text-gray-400 font-medium">No pending requests found</div>
                    ) : (
                        data.map((r: any) => (
                            <div key={r.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/30 transition-colors">
                                <div className="flex items-start gap-3.5">
                                    <img src={r.avatar} alt={r.employee} className="w-10 h-10 rounded-xl object-cover mt-0.5" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{r.employee}</span>
                                            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">{r.empId}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 mt-1">{r.type} Request</div>
                                        <p className="text-xs text-gray-500 mt-1 max-w-xl leading-normal">
                                            Reason: "{r.reason}" · Duration: {r.days} days · Submitted on {r.date}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 self-end md:self-center">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                        r.status === 'Approved' ? 'bg-green-50 text-green-700' :
                                        r.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        {r.status}
                                    </span>
                                    {r.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => approve(r.id)} 
                                                className="p-2 bg-green-50 hover:bg-green-600 border border-green-200 text-green-700 hover:text-white rounded-xl transition-all"
                                                title="Approve Request"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => reject(r.id)} 
                                                className="p-2 bg-rose-50 hover:bg-rose-600 border border-rose-200 text-rose-700 hover:text-white rounded-xl transition-all"
                                                title="Reject Request"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// 5. Attendance Admin Summary
function AttendanceView() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm flex flex-col justify-between h-32">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Present Today</span>
                        <h4 className="text-2xl font-bold text-gray-900 mt-1">142</h4>
                    </div>
                    <span className="text-[10px] text-gray-400">On-site entries</span>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm flex flex-col justify-between h-32">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Absent</span>
                        <h4 className="text-2xl font-bold text-rose-600 mt-1">8</h4>
                    </div>
                    <span className="text-[10px] text-gray-400">Unnotified absences</span>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm flex flex-col justify-between h-32">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Leaves</span>
                        <h4 className="text-2xl font-bold text-gray-900 mt-1">12</h4>
                    </div>
                    <span className="text-[10px] text-gray-400">Approved scheduled</span>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm flex flex-col justify-between h-32">
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Remote / WFH</span>
                        <h4 className="text-2xl font-bold text-gray-900 mt-1">6</h4>
                    </div>
                    <span className="text-[10px] text-gray-400">Remote active</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Today's Attendance Summary</h4>
                <p className="text-xs text-gray-500 leading-normal max-w-xl">
                    Detailed punch logs and attendance metrics are managed directly from the Time Office Portal sync database. Daily stats updates run automatically every evening at 18:00.
                </p>
            </div>
        </div>
    );
}

// 6. Trainings Hub View
function TrainingView() {
    const { data, loading } = useDataStore('hr:trainings');
    return (
        <div className="space-y-6">
            {loading ? (
                <div className="py-24 text-center text-sm text-gray-400 font-medium">Fetching scheduled courses...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.map((t: any) => (
                        <div key={t.id} className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-gray-900 leading-snug">{t.name}</h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-700 rounded-full">{t.status}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">{t.description}</p>
                                <div className="mt-4 space-y-1 text-xs text-gray-400">
                                    <div>Instructor: <strong className="text-gray-700">{t.trainer}</strong></div>
                                    <div>Scheduled Date: <strong className="text-gray-700">{t.date}</strong></div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs text-blue-600 font-bold">{t.participants} Employees Enrolled</span>
                                <button className="text-xs font-bold text-gray-400 hover:text-[#0B4DA2] flex items-center gap-0.5">
                                    Course Details <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// 7. Announcements View
function AnnouncementsView() {
    const { data, loading } = useDataStore('hr:announcements');
    return (
        <div className="space-y-6">
            {loading ? (
                <div className="py-24 text-center text-sm text-gray-400 font-medium">Fetching notices...</div>
            ) : (
                <div className="space-y-4">
                    {data.map((a: any) => (
                        <div key={a.id} className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 leading-snug">{a.title}</h4>
                                <span className="text-xs text-gray-400 font-medium">{a.date}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 leading-relaxed font-medium">{a.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============ MAIN PORTAL ============
export function HRPortal() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [query, setQuery] = useState('');

    const handleLogout = () => {
        window.location.reload();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView onTabChange={setActiveTab} />;
            case 'users': return <UserManagementView />;
            case 'salary': return <SalaryRevisionView />;
            case 'requests': return <RequestsView />;
            case 'attendance': return <AttendanceView />;
            case 'training': return <TrainingView />;
            case 'announcements': return <AnnouncementsView />;
            default: return <DashboardView onTabChange={setActiveTab} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar activeTab={activeTab} query={query} setQuery={setQuery} />
                <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
