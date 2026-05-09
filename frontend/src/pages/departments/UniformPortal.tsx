import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shirt, 
  Plus, 
  CheckCircle,
  XCircle,
  Search,
  Download,
  Eye,
  Bell,
  User,
  Settings,
  Home,
  FileText,
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowUp,
  ArrowDown,
  Clock,
  Users,
  Package,
  Send,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner@2.0.3';

import { generateGenericListPDF } from '../../utils/pdfExport';

import logo from 'figma:asset/7ef5cbbf7f7fd6bbcf30128158bd641f40437597.png';

interface UniformRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  requestType: 'new' | 'replacement' | 'additional';
  items: UniformItem[];
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'issued';
  approvedBy?: string;
  approvalDate?: string;
  reason: string;
}

interface UniformItem {
  itemType: string;
  size: string;
  quantity: number;
}

interface UniformIssueRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  items: UniformItem[];
  issueDate: string;
  nextIssueDate: string;
  status: 'active' | 'expired';
}

interface UniformStock {
  id: string;
  itemType: string;
  size: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  supplier: string;
}

export function UniformPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [uniformRequests, setUniformRequests] = useState<UniformRequest[]>([
    {
      id: 'UR001',
      employeeId: 'SMG-2024-042',
      employeeName: 'Rajesh Kumar',
      department: 'Assembly',
      designation: 'Senior Technician',
      requestType: 'new',
      items: [
        { itemType: 'Shirt', size: 'L', quantity: 2 },
        { itemType: 'Trouser', size: '32', quantity: 2 },
        { itemType: 'Safety Shoes', size: '9', quantity: 1 }
      ],
      requestDate: '2024-12-15',
      status: 'pending',
      reason: 'Newly joined employee - Initial uniform issue'
    },
    {
      id: 'UR002',
      employeeId: 'SMG-2024-089',
      employeeName: 'Priya Sharma',
      department: 'Quality',
      designation: 'Quality Inspector',
      requestType: 'replacement',
      items: [
        { itemType: 'Lab Coat', size: 'M', quantity: 1 },
        { itemType: 'Safety Gloves', size: 'M', quantity: 2 }
      ],
      requestDate: '2024-12-14',
      status: 'approved',
      approvedBy: 'HR Manager',
      approvalDate: '2024-12-15',
      reason: 'Current uniform damaged beyond repair'
    }
  ]);

  const [uniformRecords, setUniformRecords] = useState<UniformIssueRecord[]>([
    {
      id: 'UI001',
      employeeId: 'SMG-2024-089',
      employeeName: 'Priya Sharma',
      department: 'Quality',
      items: [
        { itemType: 'Lab Coat', size: 'M', quantity: 2 },
        { itemType: 'Safety Gloves', size: 'M', quantity: 3 }
      ],
      issueDate: '2024-01-15',
      nextIssueDate: '2025-01-15',
      status: 'active'
    },
    {
      id: 'UI002',
      employeeId: 'SMG-2024-042',
      employeeName: 'Rajesh Kumar',
      department: 'Assembly',
      items: [
        { itemType: 'Shirt', size: 'L', quantity: 2 },
        { itemType: 'Trouser', size: '32', quantity: 2 },
        { itemType: 'Safety Shoes', size: '9', quantity: 1 }
      ],
      issueDate: '2024-06-10',
      nextIssueDate: '2025-06-10',
      status: 'active'
    }
  ]);

  const [uniformStock, setUniformStock] = useState<UniformStock[]>([
    { id: 'US001', itemType: 'Shirt', size: 'S', quantity: 45, reorderLevel: 20, unitPrice: 450, supplier: 'ABC Textiles' },
    { id: 'US002', itemType: 'Shirt', size: 'M', quantity: 62, reorderLevel: 20, unitPrice: 450, supplier: 'ABC Textiles' },
    { id: 'US003', itemType: 'Shirt', size: 'L', quantity: 18, reorderLevel: 20, unitPrice: 450, supplier: 'ABC Textiles' },
    { id: 'US004', itemType: 'Shirt', size: 'XL', quantity: 34, reorderLevel: 20, unitPrice: 450, supplier: 'ABC Textiles' },
    { id: 'US005', itemType: 'Trouser', size: '30', quantity: 28, reorderLevel: 15, unitPrice: 550, supplier: 'ABC Textiles' },
    { id: 'US006', itemType: 'Trouser', size: '32', quantity: 15, reorderLevel: 15, unitPrice: 550, supplier: 'ABC Textiles' },
    { id: 'US007', itemType: 'Trouser', size: '34', quantity: 42, reorderLevel: 15, unitPrice: 550, supplier: 'ABC Textiles' },
    { id: 'US008', itemType: 'Safety Shoes', size: '8', quantity: 12, reorderLevel: 10, unitPrice: 1200, supplier: 'Safety Footwear Ltd' },
    { id: 'US009', itemType: 'Safety Shoes', size: '9', quantity: 22, reorderLevel: 10, unitPrice: 1200, supplier: 'Safety Footwear Ltd' },
    { id: 'US010', itemType: 'Safety Shoes', size: '10', quantity: 18, reorderLevel: 10, unitPrice: 1200, supplier: 'Safety Footwear Ltd' },
    { id: 'US011', itemType: 'Lab Coat', size: 'M', quantity: 8, reorderLevel: 10, unitPrice: 850, supplier: 'Professional Uniforms' },
    { id: 'US012', itemType: 'Lab Coat', size: 'L', quantity: 14, reorderLevel: 10, unitPrice: 850, supplier: 'Professional Uniforms' },
    { id: 'US013', itemType: 'Safety Gloves', size: 'M', quantity: 150, reorderLevel: 50, unitPrice: 120, supplier: 'Safety Equipment Co' },
    { id: 'US014', itemType: 'Safety Gloves', size: 'L', quantity: 180, reorderLevel: 50, unitPrice: 120, supplier: 'Safety Equipment Co' }
  ]);

  const notifications = [
    {
      id: 'N001',
      type: 'request',
      message: 'New uniform request from Rajesh Kumar (Assembly)',
      time: '10 mins ago',
      read: false,
      priority: 'high'
    },
    {
      id: 'N002',
      type: 'alert',
      message: 'Low stock alert: Lab Coat (M) - Only 8 units remaining',
      time: '1 hour ago',
      read: false,
      priority: 'high'
    },
    {
      id: 'N003',
      type: 'info',
      message: 'Uniform request UR002 approved by HR Manager',
      time: '3 hours ago',
      read: true,
      priority: 'medium'
    }
  ];

  const uniformProfile = {
    name: 'Uniform Management Desk',
    email: 'uniform@smg.com',
    phone: '+91 120 1234567',
    extension: 'Ext: 400',
    department: 'Personnel & Administration',
    totalUniformsIssued: 487,
    activeEmployees: 325,
    pendingRequests: uniformRequests.filter(r => r.status === 'pending').length,
    lowStockItems: uniformStock.filter(s => s.quantity <= s.reorderLevel).length
  };

  const StatCard = ({ icon: Icon, label, value, subtext, change, colorClass, onClick }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-[24px] shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer w-full text-left border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon size={28} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg ${
            change > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-[#1B254B] mb-1">{value}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </motion.button>
  );

  const handleApproveRequest = (requestId: string) => {
    setUniformRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'approved' as const, approvedBy: 'System Admin', approvalDate: new Date().toISOString().split('T')[0] } : req
      )
    );
    toast.success('Uniform request approved successfully');
  };

  const handleRejectRequest = (requestId: string) => {
    setUniformRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
    toast.error('Uniform request rejected');
  };

  const handleIssueUniform = (formData: any) => {
    const newRecord: UniformIssueRecord = {
      id: `UI${String(uniformRecords.length + 1).padStart(3, '0')}`,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      department: formData.department,
      items: JSON.parse(formData.items || '[]'),
      issueDate: new Date().toISOString().split('T')[0],
      nextIssueDate: formData.nextIssueDate,
      status: 'active'
    };
    setUniformRecords(prev => [newRecord, ...prev]);
    
    // Update the request status
    setUniformRequests(prev =>
      prev.map(req =>
        req.employeeId === formData.employeeId && req.status === 'approved' 
          ? { ...req, status: 'issued' as const } 
          : req
      )
    );
    
    toast.success(`Uniform issued to ${formData.employeeName} successfully`);
    setShowIssueDialog(false);
  };

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(() => {
      window.location.href = '/department-portal-hub';
    }, 1000);
  };

  const lowStockItems = uniformStock.filter(s => s.quantity <= s.reorderLevel);
  const unreadCount = notifications.filter(n => !n.read).length;

  const sidebarMenuItems = [
    { icon: Home, label: 'Dashboard', value: 'overview' },
    { icon: Clock, label: 'Pending Requests', value: 'requests' },
    { icon: Package, label: 'Issue Records', value: 'records' },
    { icon: Activity, label: 'Stock Management', value: 'stock' },
    { icon: BarChart3, label: 'Analytics', value: 'analytics' },
    { icon: Settings, label: 'Settings', value: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex">
      {/* Sidebar */}
      <motion.div 
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg`}
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
      >
        <div className="p-6 border-b border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex flex-col gap-3">
              <img src={logo} alt="SMG Logo" className="w-full h-auto" />
              <div className="text-center">
                <h2 className="text-[#1B254B] font-bold">P&A (Uniform) Portal</h2>
                <p className="text-xs text-gray-500">Uniform Management</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={logo} alt="SMG" className="w-10 h-10 object-contain" />
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarMenuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.value
                  ? 'bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-bold">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-sm font-bold">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1B254B]">Good Morning, Uniform Desk 👋</h1>
              <p className="text-sm text-gray-500 mt-1">Uniform distribution & stock management</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-80 border-gray-200"
                />
              </div>
              <Button
                onClick={() => setShowNotificationsDialog(true)}
                variant="outline"
                className="relative border-gray-200 hover:bg-gray-50"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setShowProfileDialog(true)}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              onClick={() => setShowNewRequestDialog(true)}
              className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Uniform Request
            </Button>
            <Button 
              onClick={() => setShowIssueDialog(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 shadow-lg shadow-emerald-500/30"
            >
              <Package className="w-4 h-4 mr-2" />
              Issue Uniform
            </Button>
            <Button 
              onClick={() => setShowStockDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90 shadow-lg shadow-purple-500/30"
            >
              <Activity className="w-4 h-4 mr-2" />
              Update Stock
            </Button>
            <Button 
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
              onClick={() => toast.info('Generating uniform report...')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Package}
              label="Uniforms Issued"
              value={uniformProfile.totalUniformsIssued.toString()}
              subtext="Total distribution"
              change={6}
              colorClass="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]"
              onClick={() => setActiveTab('records')}
            />
            <StatCard
              icon={Clock}
              label="Pending Requests"
              value={uniformProfile.pendingRequests.toString()}
              subtext="Awaiting approval"
              change={-3}
              colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
              onClick={() => setActiveTab('requests')}
            />
            <StatCard
              icon={Users}
              label="Active Employees"
              value={uniformProfile.activeEmployees.toString()}
              subtext="With uniforms"
              change={4}
              colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
              onClick={() => setActiveTab('records')}
            />
            <StatCard
              icon={AlertCircle}
              label="Low Stock Items"
              value={uniformProfile.lowStockItems.toString()}
              subtext="Need reorder"
              change={15}
              colorClass="bg-gradient-to-br from-orange-500 to-orange-600"
              onClick={() => setActiveTab('stock')}
            />
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold text-lg mb-4">Recent Requests</h3>
                  <div className="space-y-3">
                    {uniformRequests.slice(0, 5).map((request) => (
                      <div 
                        key={request.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-xs font-bold">
                            {request.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1B254B]">{request.employeeName}</p>
                            <p className="text-xs text-gray-500">{request.department} • {request.items.length} items</p>
                          </div>
                        </div>
                        <Badge variant={
                          request.status === 'approved' ? 'default' :
                          request.status === 'pending' ? 'secondary' :
                          request.status === 'issued' ? 'outline' :
                          'destructive'
                        } className="text-xs">
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div>
                <Card className="p-6 border-gray-100 shadow-md mb-6">
                  <h3 className="text-[#1B254B] font-bold mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">New Requests</span>
                      <span className="text-[#1B254B] font-bold">{uniformRequests.filter(r => r.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Issued This Month</span>
                      <span className="text-[#1B254B] font-bold">{uniformRequests.filter(r => r.status === 'issued').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Stock Items</span>
                      <span className="text-[#1B254B] font-bold">{uniformStock.length}</span>
                    </div>
                  </div>
                </Card>

                {lowStockItems.length > 0 && (
                  <Card className="p-6 border-red-100 bg-red-50 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h3 className="text-red-900 font-bold">Low Stock Alert</h3>
                    </div>
                    <div className="space-y-2">
                      {lowStockItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="text-sm">
                          <p className="text-red-800 font-bold">{item.itemType} ({item.size})</p>
                          <p className="text-red-600 text-xs">Only {item.quantity} units left</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">Uniform Requests</h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {uniformRequests.map((request) => (
                <Card key={request.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center font-bold">
                          {request.employeeName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1B254B] font-bold">{request.employeeName}</h4>
                            <Badge variant="outline" className={`text-xs ${
                              request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                              request.status === 'rejected' ? 'bg-red-50 text-red-600' :
                              request.status === 'issued' ? 'bg-blue-50 text-blue-600' :
                              'bg-yellow-50 text-yellow-600'
                            }`}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{request.employeeId} • {request.department}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Request Type</p>
                          <p className="text-sm text-[#1B254B] font-bold capitalize">{request.requestType}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Request Date</p>
                          <p className="text-sm text-[#1B254B] font-bold">{request.requestDate}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Total Items</p>
                          <p className="text-sm text-[#1B254B] font-bold">{request.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Items Requested</p>
                        <div className="space-y-1">
                          {request.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-[#1B254B]">
                              • {item.itemType} - Size {item.size} - Qty: {item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl mb-4">
                        <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Reason</p>
                        <p className="text-sm text-[#1B254B]">{request.reason}</p>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleApproveRequest(request.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Request
                          </Button>
                          <Button 
                            onClick={() => handleRejectRequest(request.id)}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">Uniform Stock</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search stock..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniformStock.map((stock) => (
                  <Card key={stock.id} className={`p-6 border-gray-100 hover:shadow-lg transition-all ${
                    stock.quantity <= stock.reorderLevel ? 'border-orange-200 bg-orange-50/30' : ''
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-[#1B254B] font-bold">{stock.itemType}</h4>
                        <p className="text-sm text-gray-500">Size: {stock.size}</p>
                      </div>
                      {stock.quantity <= stock.reorderLevel && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Low Stock
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available</span>
                        <span className={`font-bold ${stock.quantity <= stock.reorderLevel ? 'text-orange-600' : 'text-[#1B254B]'}`}>
                          {stock.quantity} units
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reorder Level</span>
                        <span className="text-[#1B254B] font-bold">{stock.reorderLevel} units</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Unit Price</span>
                        <span className="text-emerald-600 font-bold">₹{stock.unitPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Supplier</span>
                        <span className="text-[#1B254B] text-xs">{stock.supplier}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Package className="w-4 h-4 mr-1" />
                        Reorder
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Uniform Request</DialogTitle>
            <DialogDescription>
              Submit a new uniform request for an employee
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            toast.success('Uniform request submitted successfully');
            setShowNewRequestDialog(false);
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" name="employeeId" required />
              </div>
              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input id="employeeName" name="employeeName" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" required />
              </div>
              <div>
                <Label htmlFor="requestType">Request Type</Label>
                <Select name="requestType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Uniform</SelectItem>
                    <SelectItem value="replacement">Replacement</SelectItem>
                    <SelectItem value="additional">Additional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason for Request</Label>
              <Textarea id="reason" name="reason" rows={3} required />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Department Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department Name</Label>
              <p className="text-[#1B254B] font-bold">{uniformProfile.name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-[#1B254B]">{uniformProfile.email}</p>
            </div>
            <div>
              <Label>Total Uniforms Issued</Label>
              <p className="text-[#1B254B] font-bold">{uniformProfile.totalUniformsIssued}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${
                  notification.read ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100'
                }`}
              >
                <p className="text-sm text-[#1B254B]">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
