import React from 'react';
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
  Smartphone
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

export const DashboardPage = ({ userData, onNavigate }) => {
  const { leaveBalance, requests, trainings, attendanceHistory, notifications } = useApp();

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#0B4DA2] via-[#083A7E] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#87CEEB]/20 rounded-full blur-2xl -mb-10 mix-blend-overlay"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-white mb-2 text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, {userData.name}! 👋</h1>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B]">Recent Activity</h3>
            <button className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-[#05CD99]' :
                  activity.status === 'warning' ? 'bg-[#FFB547]' :
                  'bg-[#87CEEB]'
                }`} />
                <div className="flex-1">
                  <p className="font-bold text-[#1B254B] text-sm">{activity.type}</p>
                  <p className="text-sm text-[#A3AED0]">{activity.desc}</p>
                  <p className="text-xs text-[#A3AED0] mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B]">Upcoming Events</h3>
            <button className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              Calendar <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-[#0B4DA2] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                  <span className="text-xs font-bold">{event.date.split(' ')[1]}</span>
                  <span className="text-[10px] text-[#87CEEB]">{event.date.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1B254B]">{event.title}</p>
                  <p className="text-sm text-[#A3AED0] flex items-center gap-1 mt-1">
                    <Clock size={14} /> {event.time}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0B4DA2] bg-blue-50 px-3 py-1 rounded-lg">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* My Assets */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B]">My Assets</h3>
            <button onClick={() => onNavigate('general-requests')} className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {myAssets.map((asset, idx) => {
              const AssetIcon = asset.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2.5 rounded-xl text-[#0B4DA2]">
                      <AssetIcon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1B254B] text-sm">{asset.name}</p>
                      <p className="text-xs text-gray-500">{asset.type}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
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

      {/* Quick Actions */}
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
    </div>
  );
};
