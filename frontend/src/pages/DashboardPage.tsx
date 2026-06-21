import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  IndianRupee,
  Activity,
  ArrowRight,
  LogOut,
  Briefcase,
  Truck,
  Mail,
  LifeBuoy,
  Heart,
  Monitor,
  Keyboard,
  Mouse,
  Smartphone,
  X
} from 'lucide-react';

import { useApp } from '../context/AppContextEnhanced';

const THEME = {
  colors: {
    royal: '#0B4DA2',
    navy: '#042A5B',
    accent: '#87CEEB',
    success: '#05CD99',
    warning: '#FFB547',
    danger: '#EE5D50'
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const DashboardPage = ({ userData, onNavigate }) => {
  const { leaveBalance, requests, trainings, attendanceHistory, notifications } = useApp();
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const handleOpenModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
  };
  
  const handleCloseModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const presentDays = attendanceHistory?.filter(a => a.status === 'Present').length || 0;
  const totalDays = attendanceHistory?.length || 1;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  const stats = [
    { label: 'Leave Balance', value: `${leaveBalance?.casual?.remaining || 0} Days`, icon: Calendar, bgClass: 'bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]', trend: 'Active' },
    { label: 'Pending Requests', value: `${requests?.filter(r => r.status === 'Pending').length || 0}`, icon: FileText, bgClass: 'bg-gradient-to-br from-[#FFB547] to-[#e09e30]', trend: 'Review' },
    { label: 'Trainings', value: `${trainings?.length || 0} Active`, icon: Award, bgClass: 'bg-gradient-to-br from-[#05CD99] to-[#04b589]', trend: 'Growth' },
    { label: 'Attendance', value: `${attendanceRate}%`, icon: CheckCircle, bgClass: 'bg-gradient-to-br from-[#87CEEB] to-[#68b8d8]', trend: 'Good' }
  ];

  const recentActivity = notifications?.slice(0, 4).map(n => ({
    id: n.id || n._id,
    type: n.title,
    desc: n.message,
    time: n.time || new Date(n.timestamp || Date.now()).toLocaleDateString(),
    status: n.type || 'info'
  })) || [];

  const upcomingEvents = trainings?.slice(0, 3).map((t, idx) => ({
    id: t.id || idx,
    title: t.title || 'Training Program',
    date: t.date || 'TBD',
    time: t.duration || 'TBD',
    type: t.type || 'Training'
  })) || [];

  const myAssets = [
    { name: 'MacBook Pro 16"', type: 'Laptop', status: 'Excellent', icon: Monitor },
    { name: 'iPhone 13 Pro', type: 'Mobile', status: 'Good', icon: Smartphone },
    { name: 'Magic Keyboard', type: 'Accessory', status: 'Fair', icon: Keyboard }
  ];

  const activeProjects = [
    { id: 1, name: 'Employee Portal Upgrade', role: 'Frontend Lead', progress: 85 },
    { id: 2, name: 'Q3 Security Audit', role: 'Contributor', progress: 40 },
    { id: 3, name: 'Mobile App Beta', role: 'Reviewer', progress: 15 }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#0B4DA2] via-[#083A7E] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#87CEEB]/20 rounded-full blur-2xl -mb-10 mix-blend-overlay"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-white mb-2 text-2xl md:text-3xl font-extrabold tracking-tight">{getGreeting()}, {userData.name}</h1>
            <p className="text-[#87CEEB] opacity-90 text-sm md:text-base max-w-lg">Here's what's happening with your account today. You have {requests?.filter(r => r.status === 'Pending').length || 0} pending items requiring attention.</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20 shadow-inner flex items-center gap-4">
              <Clock size={28} className="text-[#87CEEB]" />
              <div>
                <p className="text-xs text-[#87CEEB] uppercase tracking-wider font-semibold mb-0.5">Current Time</p>
                <p className="text-2xl font-bold leading-none">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Action Ticker */}
      {requests?.filter(r => r.status === 'Pending').length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-sm text-yellow-600 border border-yellow-100">
              <AlertCircle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-extrabold text-sm text-yellow-800">Action Required</p>
              <p className="text-xs text-yellow-700 font-medium">You have {requests.filter(r => r.status === 'Pending').length} pending request(s) awaiting your review or action.</p>
            </div>
          </div>
          <button onClick={() => onNavigate('requests')} className="text-sm font-bold bg-white text-yellow-700 px-5 py-2 rounded-xl border border-yellow-200 shadow-sm hover:bg-yellow-500 hover:text-white hover:border-yellow-600 hover:shadow transition-all">
            Review Now
          </button>
        </div>
      )}

      {/* Quick Actions (Moved up here) */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-6 font-bold text-lg">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: "Leave", icon: Calendar, action: 'leaves' },
            { label: "Gate Pass", icon: LogOut, action: 'gate-pass' },
            { label: "Payroll", icon: IndianRupee, action: 'payroll' },
            { label: "Projects", icon: Briefcase, action: 'projects' },
            { label: "Transport", icon: Truck, action: 'transport' },
            { label: "Mail", icon: Mail, action: 'mail' },
            { label: "Support", icon: LifeBuoy, action: 'general-requests' },
            { label: "Welfare", icon: Heart, action: 'welfare' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.action === 'mail' ? alert("Opening Outlook...") : onNavigate(item.action)}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-[20px] border border-gray-100 hover:border-[#0B4DA2]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group active:scale-95"
            >
              <div className="bg-[#F4F7FE] p-3 rounded-2xl mb-3 group-hover:bg-[#0B4DA2] group-hover:text-white text-[#0B4DA2] transition-colors shadow-sm flex items-center justify-center">
                <item.icon size={22} />
              </div>
              <span className="text-[11px] font-bold text-[#1B254B] group-hover:text-[#0B4DA2] transition-colors uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgClass}`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-[#1B254B] mb-1">{stat.value}</h3>
            <p className="text-sm text-[#A3AED0]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B] font-bold text-lg">Recent Activity</h3>
            <button onClick={() => onNavigate('notifications')} className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {recentActivity.map((activity) => (
              <div key={activity.id} onClick={() => handleOpenModal('notification', activity)} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group hover:shadow-sm">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  activity.status === 'success' ? 'bg-[#05CD99]' :
                  activity.status === 'warning' ? 'bg-[#FFB547]' :
                  'bg-[#87CEEB]'
                }`} />
                <div className="flex-1">
                  <p className="font-bold text-[#1B254B] text-sm group-hover:text-[#0B4DA2] transition-colors">{activity.type}</p>
                  <p className="text-sm text-[#A3AED0] line-clamp-2">{activity.desc}</p>
                  <p className="text-xs text-[#A3AED0] mt-1 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B] font-bold text-lg">Upcoming Events</h3>
            <button onClick={() => onNavigate('training')} className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              Training <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {upcomingEvents.map((event) => (
              <div key={event.id} onClick={() => handleOpenModal('training', event)} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-50 bg-white hover:border-[#0B4DA2] hover:shadow-md transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex flex-col items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                  <span className="text-xs font-bold">{event.date.split(' ')[1]}</span>
                  <span className="text-[10px] text-[#87CEEB] font-medium tracking-wide uppercase">{event.date.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1B254B] group-hover:text-[#0B4DA2] transition-colors">{event.title}</p>
                  <p className="text-sm text-[#A3AED0] flex items-center gap-1.5 mt-1 font-medium">
                    <Clock size={14} className="text-[#87CEEB]" /> {event.time}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0B4DA2] bg-[#F4F7FE] px-3 py-1.5 rounded-lg border border-blue-100">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B] font-bold text-lg">Active Projects</h3>
            <button onClick={() => onNavigate('projects')} className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-5 flex-1">
            {activeProjects.map((project) => (
              <div key={project.id} onClick={() => handleOpenModal('project', project)} className="group cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#1B254B] group-hover:text-[#0B4DA2] transition-colors">{project.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{project.role}</p>
                  </div>
                  <span className="text-xs font-bold text-[#0B4DA2] bg-blue-50 px-2 py-1 rounded-md">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#0B4DA2] to-[#87CEEB] transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Assets */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B] font-bold text-lg">My Assets</h3>
            <button onClick={() => onNavigate('general-requests')} className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {myAssets.map((asset, idx) => {
              const AssetIcon = asset.icon;
              return (
                <div key={idx} onClick={() => handleOpenModal('asset', asset)} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white shadow-sm p-2.5 rounded-xl text-[#0B4DA2] border border-gray-100">
                      <AssetIcon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1B254B] text-sm">{asset.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{asset.type}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                    asset.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                    asset.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {asset.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1B254B]/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-200 shadow-2xl border border-gray-100">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-[#EE5D50] hover:bg-red-50 rounded-full transition-colors">
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0B4DA2] mb-4">
                {modalType === 'notification' && <Activity size={32} />}
                {modalType === 'training' && <Award size={32} />}
                {modalType === 'project' && <Briefcase size={32} />}
                {modalType === 'asset' && <Monitor size={32} />}
              </div>
              <h2 className="text-2xl font-bold text-[#1B254B] mb-2">
                {selectedItem.title || selectedItem.name || selectedItem.type}
              </h2>
              {modalType === 'project' && <span className="inline-block bg-blue-50 text-[#0B4DA2] px-3 py-1 rounded-lg text-xs font-bold mb-4">{selectedItem.role}</span>}
              {modalType === 'asset' && <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold mb-4">{selectedItem.status} Condition</span>}
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 mb-6">
                {modalType === 'notification' && <p>{selectedItem.desc}</p>}
                {modalType === 'training' && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2"><Calendar size={16} className="text-[#87CEEB]"/> <strong>Date:</strong> {selectedItem.date}</p>
                    <p className="flex items-center gap-2"><Clock size={16} className="text-[#87CEEB]"/> <strong>Duration:</strong> {selectedItem.time}</p>
                    <p className="flex items-center gap-2"><Award size={16} className="text-[#87CEEB]"/> <strong>Type:</strong> {selectedItem.type}</p>
                  </div>
                )}
                {modalType === 'project' && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-[#1B254B]">Progress</span>
                      <span className="font-bold text-[#0B4DA2]">{selectedItem.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0B4DA2] rounded-full" style={{width: `${selectedItem.progress}%`}}></div>
                    </div>
                  </div>
                )}
                {modalType === 'asset' && (
                  <div className="space-y-2">
                    <p><strong>Type:</strong> {selectedItem.type}</p>
                    <p><strong>Assigned:</strong> Yes</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => {
                handleCloseModal();
                if (modalType === 'notification') onNavigate('notifications');
                if (modalType === 'training') onNavigate('training');
                if (modalType === 'project') onNavigate(`projects:${selectedItem.id}`);
                if (modalType === 'asset') onNavigate('asset-requests');
              }} className="flex-1 bg-[#0B4DA2] hover:bg-[#042A5B] text-white py-3 rounded-xl font-bold transition-colors shadow-md shadow-blue-900/20">
                Go to Dashboard
              </button>
              <button onClick={handleCloseModal} className="flex-1 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-3 rounded-xl font-bold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
