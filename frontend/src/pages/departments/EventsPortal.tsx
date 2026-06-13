// Events Portal - Premium UI Theme
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getDeptStore, saveDeptStore } from '../../services/api';
import {
  CalendarDays,
  Ticket,
  MapPin,
  Users,
  MessageSquare,
  BarChart3,
  Search,
  Bell,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Star,
  Award,
  Calendar
} from 'lucide-react';

// ============ HOOKS ============
function useDataStore(key: string, initialData?: any[]) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getDeptStore(key).then(res => {
            if (mounted && res && Array.isArray(res)) {
                setData(res);
            } else if (mounted && initialData) {
                setData(initialData);
                saveDeptStore(key, initialData);
            }
        }).catch(err => console.error(err))
        .finally(() => { if(mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [key]);

    const api = useMemo(() => ({
        async add(item: any) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = [...prev, item];
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
            return item;
        },
        async update(matchFn: (it: any) => boolean, updater: (it: any) => any) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = prev.map(it => (matchFn(it) ? { ...it, ...updater(it) } : it));
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
        },
        async remove(matchFn: (it: any) => boolean) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = prev.filter(it => !matchFn(it));
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
        },
    }), [key]);

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

function useSort(source: any[], field: string, dir = 'asc') {
    return useMemo(() => {
        if (!field) return source;
        const sorted = [...source].sort((a, b) => {
            const av = a[field];
            const bv = b[field];
            if (typeof av === 'number' && typeof bv === 'number') {
                return av - bv;
            }
            return String(av).localeCompare(String(bv));
        });
        return dir === 'desc' ? sorted.reverse() : sorted;
    }, [source, field, dir]);
}

// ============ COMPONENTS ============
function StatCard({ title, value, subtitle, icon: Icon, colorClass, onClick }: any) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer w-full text-left border border-gray-150/80"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${colorClass}`}>
                    <Icon size={28} className="text-white" />
                </div>
            </div>
            <h3 className="text-3xl font-extrabold text-[#1B254B] mb-1">{value}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{title}</p>
            {subtitle && <p className="text-xs text-emerald-500 font-semibold mt-2">{subtitle}</p>}
        </motion.button>
    );
}

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
            case 'dashboard': return 'Event Dashboard';
            case 'events': return 'Event Management';
            case 'registrations': return 'Registrations';
            case 'schedule': return 'Schedule';
            case 'venues': return 'Venues';
            case 'sponsors': return 'Sponsors';
            case 'volunteers': return 'Volunteers';
            case 'feedback': return 'Feedback';
            case 'analytics': return 'Analytics';
            default: return 'Events Portal';
        }
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
            <div>
                <h1 className="text-xl font-bold text-[#1B254B]">{getTitle()}</h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{dayStr} · {dateStr}</p>
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
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-pink-200">
                        EM
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-[#1B254B] leading-tight">Event Manager</div>
                        <div className="text-[11px] font-medium text-gray-400">Admin</div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Sidebar({ activeTab, onTabChange, onLogout }: { activeTab: string; onTabChange: (tab: string) => void; onLogout: () => void }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'events', label: 'Events', icon: CalendarDays },
        { id: 'registrations', label: 'Registrations', icon: Ticket },
        { id: 'schedule', label: 'Schedule', icon: Clock },
        { id: 'venues', label: 'Venues', icon: MapPin },
        { id: 'sponsors', label: 'Sponsors', icon: Award },
        { id: 'volunteers', label: 'Volunteers', icon: Users },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <aside className="w-64 bg-white flex flex-col h-screen sticky top-0 z-40 border-r border-gray-100 shadow-lg">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-[#1B254B] tracking-tight leading-none">SMG Events</h2>
                    <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Event Hub</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 block mb-3">Management</span>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all ${
                                isActive 
                                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-500/20' 
                                    : 'hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button 
                    onClick={onLogout} 
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-600 rounded-xl text-sm font-semibold transition-all border border-gray-200"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 relative z-10 overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-base font-bold text-gray-900">{title}</h3>
                            <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-xl text-gray-400 hover:text-gray-600 transition-all">
                                ✕
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
const defaultEvents = [
    { id: 'E001', name: 'Annual Townhall', date: '2025-01-15', location: 'Auditorium', status: 'Upcoming' },
    { id: 'E002', name: 'Safety Training', date: '2025-12-28', location: 'Training Room A', status: 'Open' },
];

const defaultRegistrations = [
    { id: 'REG1001', eventId: 'E002', attendee: 'Priya Verma', email: 'priya.verma@example.com', status: 'Confirmed' },
    { id: 'REG1002', eventId: 'E002', attendee: 'Mohit Gupta', email: 'mohit.g@example.com', status: 'Pending' },
];

function Dashboard({ onTabChange }: { onTabChange: (tab: string) => void }) {
    const { data: events } = useDataStore('event:events', defaultEvents);
    const { data: registrations } = useDataStore('event:registrations', defaultRegistrations);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Upcoming Events" 
                    value={events.filter(e => e.status === 'Upcoming').length} 
                    icon={CalendarDays}
                    colorClass="bg-gradient-to-br from-pink-500 to-pink-600"
                    onClick={() => onTabChange('events')} 
                />
                <StatCard 
                    title="Open Registrations" 
                    value={registrations.filter(r => r.status === 'Pending').length} 
                    icon={Ticket}
                    colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                    onClick={() => onTabChange('registrations')} 
                    subtitle="Action Required"
                />
                <StatCard 
                    title="Total Attendees" 
                    value={registrations.length} 
                    icon={Users}
                    colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                />
            </div>
        </div>
    );
}

function EventsView({ query }: { query: string }) {
    const { data, api } = useDataStore('event:events', defaultEvents);
    const [createOpen, setCreateOpen] = useState(false);
    const filtered = useSearch(data, ['name', 'location', 'status'], query);
    const events = useSort(filtered, 'date', 'asc');

    const removeEvent = async (id: string) => {
        await api.remove((e: any) => e.id === id);
    };

    const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get('name') || '').trim();
        const location = String(form.get('location') || '').trim();
        const date = String(form.get('date') || '').trim();
        const status = String(form.get('status') || '').trim() || 'Upcoming';
        if (!name || !date) return;
        const id = `E${Math.floor(100 + Math.random() * 900)}`;
        await api.add({ id, name, location, date, status });
        setCreateOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => setCreateOpen(true)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-pink-500/20"
                >
                    <Plus className="w-4 h-4" /> Create Event
                </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="p-4 pl-6">Event Name</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.map((ev: any) => (
                            <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6 font-bold text-[#1B254B]">{ev.name}</td>
                                <td className="p-4 text-sm font-semibold text-gray-600">{ev.date}</td>
                                <td className="p-4 text-sm text-gray-600">{ev.location}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block ${
                                        ev.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {ev.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center pr-6">
                                    <button onClick={() => removeEvent(ev.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={createOpen} title="Create New Event" onClose={() => setCreateOpen(false)}>
                <form onSubmit={onCreate} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Event Name</label>
                        <input name="name" placeholder="Annual Townhall" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-pink-500" required />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Date</label>
                        <input name="date" type="date" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-pink-500" required />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Location</label>
                        <input name="location" placeholder="Auditorium" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-pink-500" required />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Status</label>
                        <select name="status" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-pink-500">
                            <option>Upcoming</option>
                            <option>Open</option>
                            <option>Closed</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-sm font-semibold">Save Event</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function RegistrationsView({ query }: { query: string }) {
    const { data, api } = useDataStore('event:registrations', defaultRegistrations);
    const { data: events } = useDataStore('event:events', defaultEvents);
    const filtered = useSearch(data, ['attendee', 'email', 'status'], query);

    const approve = async (id: string) => {
        await api.update((r: any) => r.id === id, () => ({ status: 'Confirmed' }));
    };
    const remove = async (id: string) => {
        await api.remove((r: any) => r.id === id);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="p-4 pl-6">Attendee</th>
                            <th className="p-4">Event</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map((r: any) => (
                            <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6">
                                    <div className="font-bold text-[#1B254B]">{r.attendee}</div>
                                    <div className="text-xs text-gray-500">{r.email}</div>
                                </td>
                                <td className="p-4 text-sm font-semibold text-gray-600">{events.find(e => e.id === r.eventId)?.name || r.eventId}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block ${
                                        r.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center pr-6">
                                    <div className="flex items-center justify-center gap-2">
                                        {r.status !== 'Confirmed' && (
                                            <button onClick={() => approve(r.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button onClick={() => remove(r.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// 4. Analytics View
function AnalyticsView() {
    const { data: events } = useDataStore('event:events', defaultEvents);
    const { data: registrations } = useDataStore('event:registrations', defaultRegistrations);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Events" value={events.length} icon={CalendarDays} colorClass="bg-pink-500" />
            <StatCard title="Total Registrations" value={registrations.length} icon={Ticket} colorClass="bg-blue-500" />
            <StatCard title="Confirmed" value={registrations.filter(r => r.status === 'Confirmed').length} icon={CheckCircle2} colorClass="bg-emerald-500" />
        </div>
    );
}

// ============ MAIN PORTAL ============
export function EventsPortal() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [query, setQuery] = useState('');

    const handleLogout = () => {
        window.location.reload();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard onTabChange={setActiveTab} />;
            case 'events': return <EventsView query={query} />;
            case 'registrations': return <RegistrationsView query={query} />;
            case 'analytics': return <AnalyticsView />;
            default: return (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-150 border-dashed">
                    <CalendarDays className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">Module under development</h3>
                    <p className="text-sm text-gray-500">This section is being upgraded with the new premium design.</p>
                </div>
            );
        }
    };

    return (
        <div className="flex h-screen bg-[#F4F7FE] overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar activeTab={activeTab} query={query} setQuery={setQuery} />
                <main className="flex-1 overflow-y-auto p-8">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto"
                    >
                        {renderContent()}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
