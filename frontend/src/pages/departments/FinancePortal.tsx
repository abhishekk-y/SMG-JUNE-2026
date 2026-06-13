// Finance Portal - Premium UI Theme
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getDeptStore, saveDeptStore } from '../../services/api';
import {
  PieChart,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  CheckCircle,
  Users,
  Briefcase,
  PackageCheck,
  BarChart,
  Search,
  Bell,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Wallet
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

// ============ UTILITY ============
function formatCurrency(n: number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

// ============ COMPONENTS ============
function StatCard({ title, value, subtitle, icon: Icon, colorClass, onClick, amount = false }: any) {
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
            <h3 className="text-3xl font-extrabold text-[#1B254B] mb-1">{amount ? formatCurrency(value) : value}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{title}</p>
            {subtitle && <p className="text-xs text-blue-500 font-semibold mt-2">{subtitle}</p>}
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
            case 'dashboard': return 'Financial Overview';
            case 'budget': return 'Budget Allocation';
            case 'expenses': return 'Operating Expenses';
            case 'invoices': return 'Invoices & Billing';
            case 'payroll': return 'Payroll & Salary';
            case 'approvals': return 'Pending Approvals';
            case 'vendors': return 'Vendor Registry';
            case 'purchaseorders': return 'Purchase Orders';
            case 'reports': return 'Financial Reports';
            default: return 'Finance Portal';
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-200">
                        FM
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-[#1B254B] leading-tight">Finance Manager</div>
                        <div className="text-[11px] font-medium text-gray-400">Admin</div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Sidebar({ activeTab, onTabChange, onLogout }: { activeTab: string; onTabChange: (tab: string) => void; onLogout: () => void }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart },
        { id: 'budget', label: 'Budget Overview', icon: PieChart },
        { id: 'approvals', label: 'Approvals', icon: CheckCircle },
        { id: 'invoices', label: 'Invoices', icon: Receipt },
        { id: 'expenses', label: 'Expenses', icon: CreditCard },
        { id: 'payroll', label: 'Payroll', icon: Users },
        { id: 'vendors', label: 'Vendors', icon: Briefcase },
        { id: 'purchaseorders', label: 'Purchase Orders', icon: PackageCheck },
        { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    ];

    return (
        <aside className="w-64 bg-white flex flex-col h-screen sticky top-0 z-40 border-r border-gray-100 shadow-lg">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <Wallet className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-[#1B254B] tracking-tight leading-none">SMG Finance</h2>
                    <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Finance Hub</span>
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
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20' 
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

// ============ DEFAULT DATA ============
const defaultBudget = [
    { id: 'BUD-2025', department: 'Operations', allocated: 6500000, spent: 4200000 },
    { id: 'BUD-2025-FIN', department: 'Finance', allocated: 3500000, spent: 1850000 },
];
const defaultExpenses = [
    { id: 'EXP-0001', desc: 'Office supplies', amount: 12000, date: '2025-12-20', status: 'Approved' },
    { id: 'EXP-0002', desc: 'Travel', amount: 54000, date: '2025-12-18', status: 'Pending' },
];
const defaultInvoices = [
    { id: 'INV-1001', vendor: 'Alpha Corp', amount: 230000, due: '2025-01-10', status: 'Open' },
    { id: 'INV-1002', vendor: 'Beta Ltd', amount: 480000, due: '2025-01-05', status: 'Paid' },
];
const defaultPayroll = [
    { id: 'PAY-DEC-2025', cycle: 'Dec 2025', employees: 138, total: 7835000, status: 'Processed' },
];
const defaultApprovals = [
    { id: 'APR-001', item: 'Budget Increase - Ops', requester: 'R. Sharma', status: 'Pending' },
];

// ============ PORTAL VIEWS ============
function Dashboard({ onTabChange }: { onTabChange: (tab: string) => void }) {
    const { data: budgetData } = useDataStore('finance:budget', defaultBudget);
    const { data: approvalsData } = useDataStore('finance:approvals', defaultApprovals);

    const totals = useMemo(() => {
        const allocated = budgetData.reduce((s: number, b: any) => s + (b.allocated || 0), 0);
        const spent = budgetData.reduce((s: number, b: any) => s + (b.spent || 0), 0);
        return { allocated, spent };
    }, [budgetData]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Allocated Budget" 
                    value={totals.allocated} 
                    amount
                    icon={PieChart}
                    colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    onClick={() => onTabChange('budget')} 
                />
                <StatCard 
                    title="Total Spent" 
                    value={totals.spent} 
                    amount
                    icon={CreditCard}
                    colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                    onClick={() => onTabChange('expenses')} 
                />
                <StatCard 
                    title="Pending Approvals" 
                    value={approvalsData.filter((a:any) => a.status === 'Pending').length} 
                    icon={CheckCircle}
                    colorClass="bg-gradient-to-br from-amber-500 to-amber-600"
                    onClick={() => onTabChange('approvals')}
                    subtitle="Action Required"
                />
            </div>
        </div>
    );
}

function BudgetView({ query }: { query: string }) {
    const { data, api } = useDataStore('finance:budget', defaultBudget);
    const budgets = useSort(useSearch(data, ['department'], query), 'department', 'asc');
    
    const updateSpent = async (id: string, delta: number) => {
        await api.update((b: any) => b.id === id, (b: any) => ({ spent: Math.max(0, (b.spent || 0) + delta) }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="p-4 pl-6">Department</th>
                            <th className="p-4">Allocated Budget</th>
                            <th className="p-4">Spent Budget</th>
                            <th className="p-4">Remaining</th>
                            <th className="p-4">Utilization</th>
                            <th className="p-4 text-center pr-6">Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {budgets.map((b: any) => {
                            const remaining = b.allocated - b.spent;
                            const utilization = b.allocated ? Math.round((b.spent / b.allocated) * 100) : 0;
                            return (
                                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6 font-bold text-[#1B254B]">{b.department}</td>
                                    <td className="p-4 font-semibold text-gray-600">{formatCurrency(b.allocated)}</td>
                                    <td className="p-4 font-semibold text-gray-900">{formatCurrency(b.spent)}</td>
                                    <td className="p-4 font-semibold text-emerald-600">{formatCurrency(remaining)}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${Math.min(utilization, 100)}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{utilization}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center pr-6">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => updateSpent(b.id, 50000)} className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md transition-colors">+50k</button>
                                            <button onClick={() => updateSpent(b.id, -50000)} className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-md transition-colors">-50k</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ExpensesView({ query }: { query: string }) {
    const { data, api } = useDataStore('finance:expenses', defaultExpenses);
    const expenses = useSort(useSearch(data, ['desc', 'status'], query), 'date', 'desc');

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="p-4 pl-6">ID</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-center pr-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {expenses.map((e: any) => (
                            <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6 font-bold text-indigo-600">{e.id}</td>
                                <td className="p-4 font-semibold text-[#1B254B]">{e.desc}</td>
                                <td className="p-4 font-bold text-gray-900">{formatCurrency(e.amount)}</td>
                                <td className="p-4 text-sm font-semibold text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                                <td className="p-4 text-center pr-6">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block ${
                                        e.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {e.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function InvoicesView({ query }: { query: string }) {
    const { data } = useDataStore('finance:invoices', defaultInvoices);
    const invoices = useSearch(data, ['vendor', 'status', 'id'], query);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-150/80 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="p-4 pl-6">Invoice</th>
                            <th className="p-4">Vendor</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4 text-center pr-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.map((inv: any) => (
                            <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6 font-bold text-indigo-600">{inv.id}</td>
                                <td className="p-4 font-semibold text-[#1B254B]">{inv.vendor}</td>
                                <td className="p-4 font-bold text-gray-900">{formatCurrency(inv.amount)}</td>
                                <td className="p-4 text-sm font-semibold text-gray-500">{inv.due}</td>
                                <td className="p-4 text-center pr-6">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block ${
                                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                        {inv.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PayrollView({ query }: { query: string }) {
    const { data } = useDataStore('finance:payroll', defaultPayroll);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((p: any) => (
                <div key={p.id} className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-[#1B254B]">{p.cycle} Payroll</h3>
                            <p className="text-sm font-medium text-gray-500">{p.employees} Employees processed</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-md">{p.status}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Payout</p>
                        <p className="text-3xl font-extrabold text-indigo-600 mt-1">{formatCurrency(p.total)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ApprovalsView({ query }: { query: string }) {
    const { data, api } = useDataStore('finance:approvals', defaultApprovals);
    const approvals = useSearch(data, ['item', 'requester', 'status'], query);

    const approve = async (id: string) => {
        await api.update((a: any) => a.id === id, () => ({ status: 'Approved' }));
    };

    return (
        <div className="space-y-4">
            {approvals.map((a: any) => (
                <div key={a.id} className="bg-white rounded-2xl p-5 border border-gray-150/80 shadow-sm flex justify-between items-center">
                    <div>
                        <div className="font-bold text-[#1B254B] text-lg">{a.item}</div>
                        <div className="text-sm font-medium text-gray-500 mt-1">Requested by: {a.requester}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                            a.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                            {a.status}
                        </span>
                        {a.status === 'Pending' && (
                            <button onClick={() => approve(a.id)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-500/20">
                                Approve
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============ MAIN PORTAL ============
export function FinancePortal() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [query, setQuery] = useState('');

    const handleLogout = () => {
        window.location.reload();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard onTabChange={setActiveTab} />;
            case 'budget': return <BudgetView query={query} />;
            case 'expenses': return <ExpensesView query={query} />;
            case 'invoices': return <InvoicesView query={query} />;
            case 'payroll': return <PayrollView query={query} />;
            case 'approvals': return <ApprovalsView query={query} />;
            default: return (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-150 border-dashed">
                    <Wallet className="w-12 h-12 text-gray-300 mb-4" />
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
