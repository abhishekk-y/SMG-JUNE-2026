import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Users,
  Filter,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  Trash2,
  Edit,
  Eye,
  X,
  Loader2,
  CheckCheck,
  RefreshCw
} from 'lucide-react';
import { broadcastNotification } from '../../services/api';

interface AdminNotificationsPageProps {
  onNavigate: (page: string) => void;
}

interface SentNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  sentTo: string;
  sentOn: string;
  recipients: number;
  readRate?: string;
}

export const AdminNotificationsPage = ({ onNavigate }: AdminNotificationsPageProps) => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [attachmentBase64, setAttachmentBase64] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{success: boolean; message: string} | null>(null);

  // Filter state: 'all' | 'today' | 'week'
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week'>('all');

  // Sent notifications state — fetched dynamically from backend
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const [overallReadRate, setOverallReadRate] = useState('0%');

  const fetchStats = async () => {
    try {
      const { getBroadcastStats } = await import('../../services/api');
      const data = await getBroadcastStats();
      if (Array.isArray(data)) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          message: d.message,
          type: 'info',
          sentTo: d.audience || 'All Employees',
          sentOn: d.date,
          recipients: d.totalCount,
          readRate: d.readRate
        }));
        setSentNotifications(mapped);

        // Compute overall read rate
        const totalSent = data.reduce((sum: number, item: any) => sum + item.totalCount, 0);
        const totalRead = data.reduce((sum: number, item: any) => sum + item.readCount, 0);
        if (totalSent > 0) {
          setOverallReadRate(`${Math.round((totalRead / totalSent) * 100)}%`);
        }
      }
    } catch (err) {
      console.error('Failed to fetch broadcast stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10s realtime polling
    return () => clearInterval(interval);
  }, []);

  const departments = [
    'Production',
    'Quality Control',
    'Engineering',
    'Sales & Marketing',
    'Administration',
    'R&D',
    'HR',
    'Finance',
    'IT',
    'Logistics',
    'Procurement',
    'Maintenance'
  ];

  // ── Filter logic ──────────────────────────────────────────────────────────
  const getFilteredNotifications = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - 7);

    return sentNotifications.filter(n => {
      const sentDate = new Date(n.sentOn);
      if (activeFilter === 'today') return sentDate >= todayStart;
      if (activeFilter === 'week') return sentDate >= weekStart;
      return true; // 'all'
    });
  };

  const filteredNotifications = getFilteredNotifications();

  // ── Stats computed from actual data ───────────────────────────────────────
  const todayCount = sentNotifications.filter(n => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return new Date(n.sentOn) >= todayStart;
  }).length;

  const totalRecipients = sentNotifications.reduce((sum, n) => sum + n.recipients, 0);

  // ── Broadcast handler — actually calls backend ────────────────────────────
  const handleBroadcast = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) return;
    if (targetAudience === 'department' && !selectedDepartment) {
      setSendResult({ success: false, message: 'Please select a department.' });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const payload = {
        title: notificationTitle.trim(),
        message: notificationMessage.trim(),
        audience: targetAudience === 'all' ? 'All Employees' : 'By Department',
        department: targetAudience === 'department' ? selectedDepartment : undefined,
        type: notificationType,
        attachment: attachmentBase64 || undefined
      };

      const result = await broadcastNotification(payload);

      const newEntry: SentNotification = {
        id: Date.now().toString(),
        title: notificationTitle.trim(),
        message: notificationMessage.trim(),
        type: notificationType,
        sentTo: targetAudience === 'all' ? 'All Employees' : selectedDepartment,
        sentOn: new Date().toISOString(),
        recipients: result?.count ?? (targetAudience === 'all' ? 1247 : 450)
      };

      setSentNotifications(prev => [newEntry, ...prev]);
      setSendResult({ success: true, message: `✅ Broadcast sent to ${newEntry.recipients} employees!` });

      // Reset form after short delay then close
      setTimeout(() => {
        setShowBroadcastModal(false);
        setNotificationTitle('');
        setNotificationMessage('');
        setNotificationType('info');
        setTargetAudience('all');
        setSelectedDepartment('');
        setSendResult(null);
      }, 1800);
    } catch (err: any) {
      setSendResult({ success: false, message: `❌ Failed: ${err.message || 'Server error'}` });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = (id: string) => {
    setSentNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-600" size={20} />;
      case 'warning': return <AlertCircle className="text-yellow-600" size={20} />;
      default: return <Info className="text-blue-600" size={20} />;
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const formatSentOn = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch { return iso; }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
            <p className="text-blue-100">Broadcast announcements and manage employee notifications</p>
          </div>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="bg-white text-[#0B4DA2] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
          >
            <Send size={18} />
            Broadcast Notification
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Bell size={24} className="text-[#0B4DA2]" />
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-2xl font-bold text-[#1B254B]">{todayCount}</p>
          <p className="text-xs text-gray-500">Total Sent Today</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-[#1B254B]">{totalRecipients.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-500">Total Recipients</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Eye size={24} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-[#1B254B]">{overallReadRate}</p>
          <p className="text-xs text-gray-500">Overall Read Rate</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={24} className="text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-[#1B254B]">{sentNotifications.length}</p>
          <p className="text-xs text-gray-500">Total Broadcast</p>
        </div>
      </div>

      {/* Sent Notifications */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1B254B] text-lg">
            Sent Notifications
            <span className="ml-2 text-sm font-normal text-gray-400">({filteredNotifications.length} shown)</span>
          </h3>
          <div className="flex gap-2">
            {/* ── Working filter buttons ── */}
            <button
              onClick={() => setActiveFilter('all')}
              className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('today')}
              className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                activeFilter === 'today'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveFilter('week')}
              className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                activeFilter === 'week'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold text-[#1B254B]">No notifications for this period</p>
            <p className="text-sm mt-1">Try selecting a different filter or broadcast a new notification.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 rounded-xl border transition-all ${getTypeClass(notification.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-[#1B254B] mb-1">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users size={12} />
                        {notification.recipients.toLocaleString('en-IN')} Recipients
                      </span>
                      {notification.readRate && (
                        <span className="text-xs text-green-600 flex items-center gap-1 font-bold">
                          <Eye size={12} />
                          {notification.readRate} Read
                        </span>
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatSentOn(notification.sentOn)}
                      </span>
                      <span className="text-xs font-bold text-[#0B4DA2] bg-white px-2 py-1 rounded">
                        {notification.sentTo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Broadcast Modal ── */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-2xl w-full shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1B254B]">Broadcast Notification</h3>
                <button
                  onClick={() => {
                    setShowBroadcastModal(false);
                    setNotificationTitle('');
                    setNotificationMessage('');
                    setSendResult(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Result Banner */}
              {sendResult && (
                <div className={`p-3 rounded-xl text-sm font-bold ${
                  sendResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {sendResult.message}
                </div>
              )}

              {/* Notification Type */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Notification Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setNotificationType('info')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      notificationType === 'info'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Info size={20} className="text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">Info</p>
                  </button>
                  <button
                    onClick={() => setNotificationType('success')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      notificationType === 'success'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <CheckCircle size={20} className="text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">Success</p>
                  </button>
                  <button
                    onClick={() => setNotificationType('warning')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      notificationType === 'warning'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <AlertCircle size={20} className="text-yellow-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">Warning</p>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#0B4DA2] focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Message <span className="text-red-500">*</span></label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter notification message..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:border-[#0B4DA2] focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Attachment (Image/PDF)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-gray-50 border border-gray-200 text-[#1B254B] px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors inline-block">
                    <span>Choose File</span>
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAttachmentBase64(reader.result as string);
                            setAttachmentName(file.name);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500">
                    {attachmentName || 'Optional: Attach an image or PDF document.'}
                  </span>
                  {attachmentName && (
                    <button 
                      onClick={() => { setAttachmentBase64(''); setAttachmentName(''); }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove Attachment"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Target Audience</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => setTargetAudience('all')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      targetAudience === 'all'
                        ? 'border-[#0B4DA2] bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Users size={20} className="text-[#0B4DA2] mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">All Employees</p>
                    <p className="text-[10px] text-gray-500 text-center">1,247 employees</p>
                  </button>
                  <button
                    onClick={() => setTargetAudience('department')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      targetAudience === 'department'
                        ? 'border-[#0B4DA2] bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Filter size={20} className="text-[#0B4DA2] mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">Specific Department</p>
                    <p className="text-[10px] text-gray-500 text-center">Select department</p>
                  </button>
                </div>

                {targetAudience === 'department' && (
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#0B4DA2] focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowBroadcastModal(false);
                  setNotificationTitle('');
                  setNotificationMessage('');
                  setSendResult(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcast}
                disabled={isSending || !notificationTitle.trim() || !notificationMessage.trim()}
                className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Broadcast Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
