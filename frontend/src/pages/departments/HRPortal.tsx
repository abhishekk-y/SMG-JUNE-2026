// HR Portal - Complete with team-provided components
import { useState, useEffect, useMemo } from 'react';

// ============ MOCK DATA ============
const hrUsers = [
    { id: 'EMP1001', name: 'Rajesh Kumar', dept: 'Production', role: 'Senior Operator', contact: '+91 98765 43210', status: 'Active' },
    { id: 'EMP1025', name: 'Priya Sharma', dept: 'Quality Control', role: 'QC Inspector', contact: '+91 98765 43211', status: 'Active' },
    { id: 'EMP1103', name: 'Anil Mehta', dept: 'R&D', role: 'Engineer', contact: '+91 98765 43212', status: 'Inactive' },
    { id: 'EMP1045', name: 'Sunita Verma', dept: 'HR', role: 'HR Executive', contact: '+91 98765 43213', status: 'Active' },
    { id: 'EMP1078', name: 'Vikram Singh', dept: 'Assembly', role: 'Technician', contact: '+91 98765 43214', status: 'Active' },
];

const hrRequests = [
    { id: 'REQ-001', type: 'Leave', employee: 'Rajesh Kumar', date: '2025-01-05', days: 3, status: 'Pending', reason: 'Family function' },
    { id: 'REQ-002', type: 'WFH', employee: 'Priya Sharma', date: '2025-01-02', days: 1, status: 'Approved', reason: 'Personal work' },
    { id: 'REQ-003', type: 'Leave', employee: 'Anil Mehta', date: '2025-01-10', days: 5, status: 'Pending', reason: 'Medical' },
];

const hrTrainings = [
    { id: 'TRN-001', name: 'Safety Training', trainer: 'External', date: '2025-01-15', participants: 25, status: 'Scheduled' },
    { id: 'TRN-002', name: 'Quality Control Basics', trainer: 'Internal', date: '2025-01-20', participants: 15, status: 'Scheduled' },
];

const hrAnnouncements = [
    { id: 'ANN-001', title: 'New Year Holiday', date: '2025-01-01', content: 'Office closed on Jan 1st, 2025.' },
    { id: 'ANN-002', title: 'Annual Review', date: '2025-01-10', content: 'Annual performance review starts from Jan 10th.' },
];

// ============ HOOKS ============
function useMockApi(key: string, initialData: any[]) {
    const storageKey = `mock:${key}`;
    const [data, setData] = useState(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : initialData;
        } catch {
            return initialData;
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch { }
    }, [data, storageKey]);

    const delay = (ms = 450) => new Promise(res => setTimeout(res, ms));

    const api = useMemo(() => ({
        async add(item: any) {
            setLoading(true);
            await delay();
            setData((prev: any[]) => [...prev, item]);
            setLoading(false);
            return item;
        },
        async update(matchFn: (it: any) => boolean, updater: (it: any) => any) {
            setLoading(true);
            await delay();
            setData((prev: any[]) => prev.map(it => (matchFn(it) ? { ...it, ...updater(it) } : it)));
            setLoading(false);
        },
        async remove(matchFn: (it: any) => boolean) {
            setLoading(true);
            await delay();
            setData((prev: any[]) => prev.filter(it => !matchFn(it)));
            setLoading(false);
        },
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
function StatCard({ title, value, subtitle, badge, onClick }: any) {
    return (
        <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', background: '#fff', borderRadius: 16, padding: 20 }}>
            <div>
                <div style={{ fontWeight: 700, fontSize: 24 }}>{value}</div>
                <div style={{ color: '#666', fontSize: 14 }}>{title}</div>
            </div>
            {badge && <span style={{ background: badge.type === 'warning' ? '#fef3c7' : '#dcfce7', color: badge.type === 'warning' ? '#b45309' : '#15803d', padding: '4px 8px', borderRadius: 4, fontSize: 12, marginTop: 8, display: 'inline-block' }}>{badge.label}</span>}
            {subtitle && <div style={{ color: '#666', marginTop: 8 }}>{subtitle}</div>}
        </div>
    );
}

function Topbar() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const dateStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayStr = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: '2-digit' });

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#fff', borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 600 }}>{dateStr} · {dayStr}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <input placeholder="Search..." style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', width: 200 }} />
                <span>✉️</span>
                <span>🔔</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0B4DA2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>HR</div>
                    <div><div style={{ fontWeight: 600 }}>HR Manager</div><div style={{ fontSize: 12, color: '#666' }}>Admin</div></div>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ activeTab, onTabChange, onLogout }: { activeTab: string; onTabChange: (tab: string) => void; onLogout: () => void }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'users', label: 'User Management', icon: '👤' },
        { id: 'requests', label: 'View Requests', icon: '📄' },
        { id: 'attendance', label: 'Attendance Admin', icon: '🗓️' },
        { id: 'training', label: 'Training Management', icon: '🎓' },
        { id: 'analytics', label: 'Department Analytics', icon: '📊' },
        { id: 'announcements', label: 'Announcements', icon: '📣' },
    ];

    return (
        <aside style={{ width: 260, background: '#fff', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ padding: 20, borderBottom: '1px solid #eee' }}>
                <img src="/Company Logo.jpg" alt="SMG" style={{ width: '100%', height: 'auto', marginBottom: 16 }} />
                <div style={{ fontWeight: 700 }}>SMG HR Portal</div>
                <small style={{ color: '#666' }}>Human Resources</small>
            </div>

            <nav style={{ flex: 1, padding: 12 }}>
                <div style={{ fontSize: 12, color: '#999', fontWeight: 600, padding: '8px 12px' }}>Admin</div>
                {menuItems.slice(0, 4).map(item => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        style={{ border: 'none', background: activeTab === item.id ? '#0B4DA2' : 'transparent', color: activeTab === item.id ? '#fff' : '#333', textAlign: 'left', width: '100%', padding: '12px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
                <div style={{ fontSize: 12, color: '#999', fontWeight: 600, padding: '8px 12px', marginTop: 12 }}>Operations</div>
                {menuItems.slice(4).map(item => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        style={{ border: 'none', background: activeTab === item.id ? '#0B4DA2' : 'transparent', color: activeTab === item.id ? '#fff' : '#333', textAlign: 'left', width: '100%', padding: '12px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div style={{ padding: 12, borderTop: '1px solid #eee' }}>
                <button onClick={onLogout} style={{ border: 'none', background: 'transparent', textAlign: 'left', padding: '12px 16px', cursor: 'pointer', width: '100%' }}>↪ Sign Out</button>
            </div>
        </aside>
    );
}

function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 400, maxWidth: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ============ PORTAL VIEWS ============
function Dashboard({ onTabChange }: { onTabChange: (tab: string) => void }) {
    const userData = useMockApi('hr:users', hrUsers).data;
    const requestData = useMockApi('hr:requests', hrRequests).data;

    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>HR · Overview</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard title="Total Employees" value={userData.length} onClick={() => onTabChange('users')} />
                <StatCard title="Active" value={userData.filter((u: any) => u.status === 'Active').length} />
                <StatCard title="Pending Requests" value={requestData.filter((r: any) => r.status === 'Pending').length} badge={{ type: 'warning', label: 'Action Required' }} onClick={() => onTabChange('requests')} />
                <StatCard title="Trainings" value={hrTrainings.length} onClick={() => onTabChange('training')} />
            </div>
        </div>
    );
}

function UserManagementView() {
    const { data, api } = useMockApi('hr:users', hrUsers);
    const [query, setQuery] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const filtered = useSearch(data, ['name', 'dept', 'role', 'status'], query);

    const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get('name') || '').trim();
        const dept = String(form.get('dept') || '').trim();
        const role = String(form.get('role') || '').trim();
        const contact = String(form.get('contact') || '').trim();
        if (!name || !dept) return;
        const id = `EMP${Math.floor(1000 + Math.random() * 9000)}`;
        await api.add({ id, name, dept, role, contact, status: 'Active' });
        setCreateOpen(false);
        e.currentTarget.reset();
    };

    const toggleStatus = async (id: string) => {
        await api.update((u: any) => u.id === id, (u: any) => ({ status: u.status === 'Active' ? 'Inactive' : 'Active' }));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>User Management</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <button onClick={() => setCreateOpen(true)} style={{ background: '#0B4DA2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>+ Add Employee</button>
                </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: 12 }}>ID</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Name</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Department</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Role</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Contact</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
                    </tr></thead>
                    <tbody>
                        {filtered.map((u: any) => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12, color: '#0B4DA2', fontWeight: 600 }}>{u.id}</td>
                                <td style={{ padding: 12 }}>{u.name}</td>
                                <td style={{ padding: 12 }}>{u.dept}</td>
                                <td style={{ padding: 12 }}>{u.role}</td>
                                <td style={{ padding: 12 }}>{u.contact}</td>
                                <td style={{ padding: 12 }}><span style={{ background: u.status === 'Active' ? '#dcfce7' : '#fee2e2', color: u.status === 'Active' ? '#15803d' : '#dc2626', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{u.status}</span></td>
                                <td style={{ padding: 12 }}>
                                    <button onClick={() => toggleStatus(u.id)} style={{ padding: '4px 8px', cursor: 'pointer', marginRight: 4 }}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={createOpen} title="Add Employee" onClose={() => setCreateOpen(false)}>
                <form onSubmit={onCreate} style={{ display: 'grid', gap: 12 }}>
                    <label style={{ fontWeight: 600 }}>Name</label>
                    <input name="name" placeholder="Full Name" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Department</label>
                    <input name="dept" placeholder="Department" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Role</label>
                    <input name="role" placeholder="Role" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Contact</label>
                    <input name="contact" placeholder="+91 98765 43210" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button type="submit" style={{ background: '#0B4DA2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => setCreateOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function RequestsView() {
    const { data, api } = useMockApi('hr:requests', hrRequests);
    const approve = async (id: string) => {
        await api.update((r: any) => r.id === id, () => ({ status: 'Approved' }));
    };
    const reject = async (id: string) => {
        await api.update((r: any) => r.id === id, () => ({ status: 'Rejected' }));
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>View Requests</h2></div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                {data.map((r: any) => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #eee' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>{r.employee} - {r.type}</div>
                            <div style={{ color: '#666', fontSize: 14 }}>{r.date} ({r.days} days) - {r.reason}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ background: r.status === 'Approved' ? '#dcfce7' : r.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: r.status === 'Approved' ? '#15803d' : r.status === 'Rejected' ? '#dc2626' : '#b45309', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{r.status}</span>
                            {r.status === 'Pending' && (
                                <>
                                    <button onClick={() => approve(r.id)} style={{ background: '#15803d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Approve</button>
                                    <button onClick={() => reject(r.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Reject</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AttendanceView() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Attendance Admin</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard title="Present Today" value="142" />
                <StatCard title="Absent" value="8" />
                <StatCard title="On Leave" value="12" />
                <StatCard title="WFH" value="6" />
            </div>
            <div style={{ marginTop: 24, background: '#fff', borderRadius: 16, padding: 20 }}>
                <h3>Today's Attendance Summary</h3>
                <p style={{ color: '#666' }}>Attendance data will be displayed here.</p>
            </div>
        </div>
    );
}

function TrainingView() {
    const { data } = useMockApi('hr:trainings', hrTrainings);
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Training Management</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {data.map((t: any) => (
                    <div key={t.id} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                        <h3 style={{ margin: 0 }}>{t.name}</h3>
                        <p style={{ color: '#666', margin: '8px 0' }}>Trainer: {t.trainer}</p>
                        <p style={{ color: '#666', margin: '4px 0' }}>Date: {t.date}</p>
                        <p style={{ color: '#666', margin: '4px 0' }}>Participants: {t.participants}</p>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{t.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AnalyticsView() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Department Analytics</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <StatCard title="Total Headcount" value={hrUsers.length} />
                <StatCard title="Avg. Attendance" value="94%" />
                <StatCard title="Training Completion" value="87%" />
            </div>
            <div style={{ marginTop: 24, background: '#fff', borderRadius: 16, padding: 20 }}>
                <h3>Department Distribution</h3>
                <p style={{ color: '#666' }}>Analytics charts will be displayed here.</p>
            </div>
        </div>
    );
}

function AnnouncementsView() {
    const { data } = useMockApi('hr:announcements', hrAnnouncements);
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Announcements</h2></div>
            <div>
                {data.map((a: any) => (
                    <div key={a.id} style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{a.title}</h3>
                            <span style={{ color: '#666', fontSize: 14 }}>{a.date}</span>
                        </div>
                        <p style={{ color: '#666', margin: '12px 0 0' }}>{a.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============ MAIN PORTAL ============
export function HRPortal() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        window.location.reload();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard onTabChange={setActiveTab} />;
            case 'users': return <UserManagementView />;
            case 'requests': return <RequestsView />;
            case 'attendance': return <AttendanceView />;
            case 'training': return <TrainingView />;
            case 'analytics': return <AnalyticsView />;
            case 'announcements': return <AnnouncementsView />;
            default: return <Dashboard onTabChange={setActiveTab} />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Topbar />
                <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
