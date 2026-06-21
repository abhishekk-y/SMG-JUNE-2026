import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { apiFetch, downloadPDF } from '../services/api';

export const LeavesPage = () => {
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [days, setDays] = useState('1');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [balance, setBalance] = useState<any>({
    annualTotal: 20, annualUsed: 0,
    sickTotal: 10,   sickUsed: 0,
    casualTotal: 8,  casualUsed: 0
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // BUG-008 FIX: use apiFetch so Authorization: Bearer <token> header is sent
    apiFetch(`/leaves/${userId}`)
      .then((data: any) => { if (Array.isArray(data)) setLeaveRequests(data); })
      .catch(console.error);

    apiFetch(`/leave-balance/${userId}`)
      .then((data: any) => { if (data) setBalance(data); })
      .catch(console.error);
  }, []);

  const leaveBalance = [
    {
      type: 'Annual Leave',
      total: balance.annualTotal,
      used: balance.annualUsed || 0,
      remaining: (balance.annualTotal) - (balance.annualUsed || 0),
      color: '#0B4DA2'
    },
    {
      type: 'Sick Leave',
      total: balance.sickTotal,
      used: balance.sickUsed || 0,
      remaining: (balance.sickTotal) - (balance.sickUsed || 0),
      color: '#05CD99'
    },
    {
      type: 'Casual Leave',
      total: balance.casualTotal,
      used: balance.casualUsed || 0,
      remaining: (balance.casualTotal) - (balance.casualUsed || 0),
      color: '#FFB547'
    },
  ];

  const handleDownload = (id: string) => {
    downloadPDF('leave', id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={16} className="text-[#05CD99]" />;
      case 'Rejected': return <XCircle size={16} className="text-[#EE5D50]" />;
      default: return <Clock size={16} className="text-[#FFB547]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-[#05CD99]';
      case 'Rejected': return 'bg-red-50 text-[#EE5D50]';
      default: return 'bg-orange-50 text-[#FFB547]';
    }
  };

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !reason) {
      alert('Please fill all required fields');
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setIsSubmitting(true);

    try {
      // BUG-008 FIX: use apiFetch so JWT token is sent in Authorization header
      const newLeave = await apiFetch('/leaves', {
        method: 'POST',
        body: JSON.stringify({
          user: userId,
          type: leaveType,
          from: fromDate,
          to: toDate,
          days: Number(days),
          reason: reason,
          status: 'Pending'
        })
      });
      setLeaveRequests((prev: any[]) => [newLeave, ...prev]);
      setShowNewLeaveForm(false);
      setFromDate(''); setToDate(''); setReason(''); setDays('1');
      alert('Leave application submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit leave request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2 flex items-center gap-3"><Calendar size={32} /> Leave Management</h1>
            <p className="text-[#87CEEB] opacity-90">Apply for leaves and track your requests</p>
          </div>
          <button
            onClick={() => setShowNewLeaveForm(!showNewLeaveForm)}
            className="bg-white text-[#0B4DA2] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> Apply Leave
          </button>
        </div>
      </div>

      {showNewLeaveForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0B4DA2]">
          <h3 className="text-[#1B254B] mb-6">New Leave Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#A3AED0] mb-2 block">Leave Type</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none">
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#A3AED0] mb-2 block">Number of Days</label>
              <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" placeholder="1" min="1" />
            </div>
            <div>
              <label className="text-sm text-[#A3AED0] mb-2 block">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" />
            </div>
            <div>
              <label className="text-sm text-[#A3AED0] mb-2 block">To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-[#A3AED0] mb-2 block">Reason</label>
              <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" placeholder="Enter reason for leave..." />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button onClick={() => setShowNewLeaveForm(false)} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaveBalance.map((leave, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="text-[#1B254B] mb-4">{leave.type}</h4>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-sm text-[#A3AED0]">Remaining</p>
                <p className="text-4xl font-bold" style={{ color: leave.color }}>{leave.remaining}</p>
              </div>
              <p className="text-sm text-[#A3AED0]">of {leave.total} days</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (leave.used / leave.total) * 100)}%`, backgroundColor: leave.color }}
              />
            </div>
            <p className="text-xs text-[#A3AED0] mt-2">{leave.used} days used</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-6">Leave History</h3>
        {leaveRequests.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No leave requests found.</p>
        ) : (
          <div className="space-y-3">
            {leaveRequests.map((request: any) => (
              <div key={request._id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#0B4DA2] transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-[#1B254B]">{request.type}</h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#A3AED0]">
                      <p className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(request.from).toLocaleDateString()} to {new Date(request.to).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock size={14} /> {request.days} day{request.days > 1 ? 's' : ''}
                      </p>
                      <p>Approver: {request.approver || 'Pending'}</p>
                    </div>
                    <p className="text-sm text-[#A3AED0] mt-2">Reason: {request.reason}</p>
                  </div>
                  {request.status === 'Approved' && (
                    <button
                      onClick={() => handleDownload(request._id)}
                      className="flex items-center gap-2 text-xs font-bold text-[#0B4DA2] hover:underline ml-4"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
