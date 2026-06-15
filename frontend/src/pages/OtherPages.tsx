import React, { useState, useEffect } from 'react';
import { Shirt, Smartphone, Package, FileText, Eye, Receipt, GraduationCap, FolderOpen, Heart, Lightbulb, BookOpen, Megaphone, Bell, Download, PlusCircle, Clock, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContextEnhanced';
import {
  getUniformRequests, requestUniform,
  getSIMRequests, requestSIM,
  getAssetRequests, requestAsset,
  getGeneralRequests, submitGeneralRequest,
  getPayroll, getTrainings, enrollTraining,
  getDocuments, getWelfarePrograms, enrollWelfare,
  getIdeas, submitIdea, getPolicies, getAnnouncements,
  getNotifications, markNotificationRead
} from '../services/api';

const API = 'http://localhost:5000/api';

const SimplePage = ({ icon: Icon, title, description, children }: any) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
      <h1 className="text-white mb-2 flex items-center gap-3"><Icon size={32} /> {title}</h1>
      <p className="text-[#87CEEB] opacity-90">{description}</p>
    </div>
    {children}
  </div>
);

export const UniformPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('userId');

  const fetchRequests = () => {
    if (userId) {
      getUniformRequests(userId)
        .then(data => setRequests(data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => fetchRequests(), []);

  const handleRequest = async (item: string) => {
    if (!userId) return alert('Please log in');
    setIsSubmitting(true);
    try {
      await requestUniform({ user: userId, itemType: item, status: 'Pending' });
      alert('Uniform requested successfully!');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to request uniform');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SimplePage icon={Shirt} title="Uniform Requests" description="Request and manage your work uniforms">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <h3 className="text-[#1B254B] mb-4">Available Uniforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Work Shirt - Blue', 'Safety Vest', 'Work Pants'].map((item, idx) => (
            <div key={idx} className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#0B4DA2] transition-all text-center">
              <Shirt size={48} className="mx-auto mb-3 text-[#0B4DA2]" />
              <h4 className="font-bold text-[#1B254B] mb-2">{item}</h4>
              <button 
                onClick={() => handleRequest(item)}
                disabled={isSubmitting}
                className="w-full bg-[#0B4DA2] text-white py-2 rounded-lg font-bold hover:bg-[#042A5B] transition-colors disabled:opacity-50">
                {isSubmitting ? 'Requesting...' : 'Request'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4">My Requests</h3>
        <div className="space-y-3">
          {requests.map((req, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-[#1B254B]">{req.itemType}</p>
                <p className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${req.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                {req.status}
              </span>
            </div>
          ))}
          {requests.length === 0 && <p className="text-gray-400 text-center py-4">No uniform requests yet.</p>}
        </div>
      </div>
    </SimplePage>
  );
};

export const SIMAllocationPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('userId');

  const fetchRequests = () => {
    if (userId) {
      getSIMRequests(userId)
        .then(data => setRequests(data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => fetchRequests(), []);

  const handleRequest = async (planName: string) => {
    if (!userId) return alert('Please log in');
    setIsSubmitting(true);
    try {
      await requestSIM({
        user: userId,
        requestId: `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        planType: planName,   // ← was 'plan', model expects 'planType'
        status: 'Pending',
        purpose: 'Official Use'
      });
      alert('SIM requested successfully!');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to request SIM');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SimplePage icon={Smartphone} title="SIM Allocation" description="Request official SIM cards for business use">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <h3 className="text-[#1B254B] mb-4">SIM Card Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Basic Plan', data: '2GB/day', calls: 'Unlimited', price: 'Free' },
            { name: 'Premium Plan', data: '5GB/day', calls: 'Unlimited', price: 'Free' },
          ].map((plan, idx) => (
            <div key={idx} className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#0B4DA2] transition-all">
              <h4 className="font-bold text-[#1B254B] mb-3">{plan.name}</h4>
              <div className="space-y-2 mb-4 text-sm text-[#A3AED0]">
                <p>Data: {plan.data}</p>
                <p>Calls: {plan.calls}</p>
                <p className="font-bold text-[#0B4DA2]">Price: {plan.price}</p>
              </div>
              <button 
                onClick={() => handleRequest(plan.name)}
                disabled={isSubmitting}
                className="w-full bg-[#0B4DA2] text-white py-2 rounded-lg font-bold hover:bg-[#042A5B] transition-colors disabled:opacity-50">
                {isSubmitting ? 'Requesting...' : 'Request SIM'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4">My Requests</h3>
        <div className="space-y-3">
          {requests.map((req, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-[#1B254B]">{req.plan}</p>
                <p className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${req.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                {req.status}
              </span>
            </div>
          ))}
          {requests.length === 0 && <p className="text-gray-400 text-center py-4">No SIM requests yet.</p>}
        </div>
      </div>
    </SimplePage>
  );
};

export const AssetRequestsPage = () => {
  const [assetType, setAssetType] = useState('Laptop');
  const [priority, setPriority] = useState('Medium');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('userId');

  const fetchRequests = () => {
    if (userId) {
      getAssetRequests(userId)
        .then(data => setRequests(data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => fetchRequests(), []);

  const handleSubmit = async () => {
    if (!userId) return alert('Please log in');
    if (!reason.trim()) return alert('Justification is required');
    setIsSubmitting(true);
    try {
     await requestAsset({
      user: userId,
      requestId: `AR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      assetType,
      priority,
      justification: reason,   // ← was 'reason', model expects 'justification'
      status: 'Pending'
    });
      alert('Asset requested successfully!');
      setReason('');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to request asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SimplePage icon={Package} title="Asset Requests" description="Request IT and office assets">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <h3 className="text-[#1B254B] mb-4">Request New Asset</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-[#A3AED0] mb-2 block">Asset Type</label>
            <select value={assetType} onChange={e => setAssetType(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none">
              <option>Laptop</option>
              <option>Monitor</option>
              <option>Keyboard</option>
              <option>Mouse</option>
              <option>Headset</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[#A3AED0] mb-2 block">Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-[#A3AED0] mb-2 block">Justification</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" placeholder="Explain why you need this asset..."></textarea>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting} className="mt-4 bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors disabled:opacity-50">
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4">My Requests</h3>
        <div className="space-y-3">
          {requests.map((req, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-[#1B254B]">{req.assetType}</p>
                <p className="text-sm text-gray-500">Priority: {req.priority} • {new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${req.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                {req.status}
              </span>
            </div>
          ))}
          {requests.length === 0 && <p className="text-gray-400 text-center py-4">No asset requests yet.</p>}
        </div>
      </div>
    </SimplePage>
  );
};

export const GeneralRequestsPage = () => {
  const [category, setCategory] = useState('Facilities');
  const [priority, setPriority] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateNewId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setGeneratedId(`CMP-2026-${randomNum}`);
  };

  const fetchRequests = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    getGeneralRequests(userId)
      .then(data => setRequestsList(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    generateNewId();
    fetchRequests();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return alert('Please fill out all fields');
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('User is not logged in');

    setIsSubmitting(true);
    submitGeneralRequest({
        user: userId, reqId: generatedId, category, subject, description, priority, status: 'Pending'
      })
      .then(() => {
        alert('Request submitted successfully!');
        setSubject(''); setDescription('');
        generateNewId(); fetchRequests();
      })
      .catch((err: any) => alert(err.message || 'Server connection failed'))
      .finally(() => setIsSubmitting(false));
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Resolved' || status === 'Closed') return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold"><CheckCircle className="w-3.5 h-3.5" /><span>{status}</span></span>;
    if (status === 'Rejected') return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold"><XCircle className="w-3.5 h-3.5" /><span>{status}</span></span>;
    if (status === 'In Progress') return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold animate-pulse"><Clock className="w-3.5 h-3.5" /><span>{status}</span></span>;
    return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold"><Clock className="w-3.5 h-3.5" /><span>{status}</span></span>;
  };

  const getPriorityBadge = (prio: string) => {
    if (prio === 'High') return <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">High</span>;
    if (prio === 'Medium') return <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-200">Medium</span>;
    return <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">Low</span>;
  };

  return (
    <SimplePage icon={FileText} title="General Requests" description="Submit general workplace requests and grievances">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1B254B]">New Request</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Complaint ID</label>
              <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-mono text-sm text-[#0B4DA2] font-bold">{generatedId}</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm">
                <option>Facilities</option><option>IT Support</option><option>HR Query</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Priority *</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Subject *</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm" placeholder="Brief summary" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Description *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm resize-none" placeholder="Detailed description..." required></textarea>
            </div>
            <button type="submit" disabled={isSubmitting || !subject || !description} className="w-full bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors disabled:opacity-50 text-sm">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1B254B]">Request History</h3>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white text-xs font-bold uppercase">
                  <th className="px-4 py-3">ID</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {requestsList.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-[#0B4DA2]">{req.reqId}</td>
                    <td className="px-4 py-4">{req.category}</td>
                    <td className="px-4 py-4 font-medium">{req.subject}</td>
                    <td className="px-4 py-4">{getPriorityBadge(req.priority)}</td>
                    <td className="px-4 py-4">{getStatusBadge(req.status)}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs">{new Date(req.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {requestsList.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No requests found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SimplePage>
  );
};

export const MyAttendancePage = () => (
  <SimplePage icon={Eye} title="My Attendance View" description="View your attendance records and patterns">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Present Days', value: '22', color: '#05CD99' },
        { label: 'Absent Days', value: '1', color: '#EE5D50' },
        { label: 'Late Arrivals', value: '3', color: '#FFB547' },
        { label: 'Overtime Hours', value: '12', color: '#0B4DA2' },
      ].map((stat, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <p className="text-sm text-[#A3AED0] mb-2">{stat.label}</p>
          <p className="text-4xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
        </div>
      ))}
    </div>
  </SimplePage>
);

export const PayrollPage = () => {
  const [payslips, setPayslips] = useState<any[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      getPayroll(userId)
        .then(data => setPayslips(data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleDownload = (payslipId: string) => {
    window.open(`${API}/pdf/payslip/${payslipId}`, '_blank');
  };

  return (
    <SimplePage icon={Receipt} title="Payroll & Salary" description="View your salary details and download payslips">
      <div className="space-y-4">
        {payslips.map((slip, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1B254B] font-bold">{slip.month} {slip.year}</h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${slip.status === 'Paid' ? 'bg-green-50 text-[#05CD99]' : 'bg-yellow-50 text-yellow-600'}`}>
                  {slip.status || 'Paid'}
                </span>
                <button onClick={() => handleDownload(slip._id)} className="flex items-center gap-2 bg-[#0B4DA2] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#042A5B] transition-colors text-sm">
                  <FileText size={16} /> Download PDF
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span className="text-[#A3AED0]">Basic Salary</span><span className="font-bold text-[#1B254B]">₹{slip.basicSalary?.toLocaleString() || 0}</span></div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span className="text-[#A3AED0]">HRA</span><span className="font-bold text-[#1B254B]">₹{slip.hra?.toLocaleString() || 0}</span></div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span className="text-[#A3AED0]">Allowances</span><span className="font-bold text-[#1B254B]">₹{slip.allowances?.toLocaleString() || 0}</span></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span className="text-[#A3AED0]">Deductions</span><span className="font-bold text-[#EE5D50]">-₹{slip.totalDeductions?.toLocaleString() || 0}</span></div>
                <div className="flex justify-between p-3 bg-green-50 rounded-xl border-2 border-green-200"><span className="font-bold text-[#05CD99]">Net Salary</span><span className="font-bold text-[#05CD99] text-xl">₹{slip.netSalary?.toLocaleString() || 0}</span></div>
              </div>
            </div>
          </div>
        ))}
        {payslips.length === 0 && <div className="bg-white rounded-2xl p-8 shadow-lg text-center text-gray-400">No payslips available</div>}
      </div>
    </SimplePage>
  );
};

export const TrainingPage = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);
  const userId = localStorage.getItem('userId');

  const fetchTrainings = () => {
    getTrainings()
      .then(data => setTrainings(data))
      .catch(err => console.error(err));
  };

  useEffect(() => fetchTrainings(), []);

  const handleEnroll = async (id: string) => {
    if (!userId) return alert('Please log in');
    setIsEnrolling(id);
    try {
      await enrollTraining(id, userId);
      alert('Enrolled successfully!');
      fetchTrainings();
    } catch (err: any) {
      alert(err.message || 'Server error');
    } finally {
      setIsEnrolling(null);
    }
  };

  return (
    <SimplePage icon={GraduationCap} title="Training & Development" description="Explore and enroll in training programs">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trainings.map((course) => {
          const isEnrolled = course.enrolledUsers?.some((u: any) => u._id === userId || u === userId);
          return (
            <div key={course._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-bold text-[#1B254B]">{course.title}</h4>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${course.type === 'Required' ? 'bg-red-50 text-[#EE5D50]' : 'bg-blue-50 text-[#0B4DA2]'}`}>
                  {course.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>
              <div className="space-y-2 text-sm text-[#A3AED0] mb-4">
                <p>Date: {new Date(course.date).toLocaleDateString()}</p>
                <p>Duration: {course.duration}</p>
              </div>
              <button 
                onClick={() => handleEnroll(course._id)}
                disabled={isEnrolled || isEnrolling === course._id}
                className={`w-full py-2 rounded-lg font-bold transition-colors ${isEnrolled ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-[#0B4DA2] text-white hover:bg-[#042A5B]'}`}>
                {isEnrolling === course._id ? 'Enrolling...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
              </button>
            </div>
          );
        })}
        {trainings.length === 0 && <p className="text-gray-400">No training programs available.</p>}
      </div>
    </SimplePage>
  );
};

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      getDocuments(userId)
        .then(data => setDocuments(data))
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <SimplePage icon={FolderOpen} title="My Documents" description="Access and manage your documents">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="space-y-3">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <FolderOpen className="text-[#0B4DA2]" size={24} />
                <div>
                  <p className="font-bold text-[#1B254B]">{doc.title}</p>
                  <p className="text-sm text-[#A3AED0]">{doc.category} • {doc.status}</p>
                </div>
              </div>
              <p className="text-sm text-[#A3AED0]">{new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {documents.length === 0 && <p className="text-gray-400 py-4 text-center">No documents uploaded.</p>}
        </div>
      </div>
    </SimplePage>
  );
};

export const WelfarePage = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);
  const userId = localStorage.getItem('userId');

  const fetchPrograms = () => {
    getWelfarePrograms()
      .then(data => setPrograms(data))
      .catch(err => console.error(err));
  };

  useEffect(() => fetchPrograms(), []);

  const handleEnroll = async (id: string) => {
    if (!userId) return alert('Please log in');
    setIsEnrolling(id);
    try {
      await enrollWelfare(id, userId);
      alert('Enrolled successfully in welfare program!');
      fetchPrograms();
    } catch (err: any) {
      alert(err.message || 'Server error');
    } finally {
      setIsEnrolling(null);
    }
  };

  return (
    <SimplePage icon={Heart} title="Employee Welfare" description="Health and wellness programs for employees">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((prog) => {
          const isEnrolled = prog.enrolledUsers?.includes(userId);
          return (
            <div key={prog._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <Heart size={48} className="mx-auto mb-3 text-[#0B4DA2]" />
              <h4 className="font-bold text-[#1B254B] mb-2">{prog.title}</h4>
              <p className="text-sm text-gray-500 mb-4">{prog.description}</p>
              <button 
                onClick={() => handleEnroll(prog._id)}
                disabled={isEnrolled || isEnrolling === prog._id}
                className={`w-full py-2 rounded-lg font-bold transition-colors mt-3 ${isEnrolled ? 'bg-green-50 text-green-600 cursor-not-allowed' : 'bg-[#0B4DA2] text-white hover:bg-[#042A5B]'}`}>
                {isEnrolling === prog._id ? 'Enrolling...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
              </button>
            </div>
          );
        })}
        {programs.length === 0 && <p className="text-gray-400 py-4 col-span-2 text-center">No welfare programs currently active.</p>}
      </div>
    </SimplePage>
  );
};

export const ImaginePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('userId');

  const fetchIdeas = () => {
    getIdeas()
      .then(data => setIdeas(data))
      .catch(err => console.error(err));
  };

  useEffect(() => fetchIdeas(), []);

  const handleSubmit = async () => {
    if (!userId) return alert('Please log in');
    if (!title || !description) return alert('Please enter title and description');
    setIsSubmitting(true);
    try {
      await submitIdea({ user: userId, title, description, category: 'General' });
      alert('Idea submitted successfully!');
      setTitle(''); setDescription('');
      fetchIdeas();
    } catch (err: any) {
      alert(err.message || 'Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SimplePage icon={Lightbulb} title="SMG Imagine" description="Innovation and ideas platform">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <h3 className="text-[#1B254B] mb-4">Submit Your Idea</h3>
        <div className="space-y-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" placeholder="Idea Title" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" placeholder="Describe your innovative idea..."></textarea>
          <button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit Idea'}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4">Recent Ideas</h3>
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea._id} className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-[#1B254B]">{idea.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
              <div className="mt-2 text-xs text-gray-400">By: {idea.user?.name || 'Anonymous'} • {idea.votes || 0} votes</div>
            </div>
          ))}
          {ideas.length === 0 && <p className="text-gray-400">No ideas yet. Be the first!</p>}
        </div>
      </div>
    </SimplePage>
  );
};

export const PoliciesPage = () => {
  const [policies, setPolicies] = useState<any[]>([]);

  useEffect(() => {
    getPolicies()
      .then(data => setPolicies(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <SimplePage icon={BookOpen} title="Company Policies" description="Access company policies and guidelines">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((policy) => (
            <div key={policy._id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#0B4DA2] transition-all">
              <BookOpen className="text-[#0B4DA2] mb-3" size={32} />
              <h4 className="font-bold text-[#1B254B] mb-2">{policy.title}</h4>
              <p className="text-xs text-gray-500 mb-3">{policy.category} • v{policy.version || '1.0'}</p>
              <button className="text-[#0B4DA2] font-bold text-sm hover:underline">View Policy →</button>
            </div>
          ))}
          {policies.length === 0 && <p className="text-gray-400 col-span-2 text-center py-4">No policies published.</p>}
        </div>
      </div>
    </SimplePage>
  );
};

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    getAnnouncements()
      .then(data => setAnnouncements(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <SimplePage icon={Megaphone} title="Announcements" description="Latest company announcements and updates">
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-[#1B254B] mb-2">{ann.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{ann.content}</p>
                <p className="text-sm text-[#A3AED0]">{new Date(ann.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${ann.priority === 'High' ? 'bg-red-50 text-[#EE5D50]' : 'bg-orange-50 text-[#FFB547]'}`}>
                {ann.priority || 'Normal'}
              </span>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-gray-400 py-4 text-center bg-white rounded-2xl">No active announcements.</p>}
      </div>
    </SimplePage>
  );
};

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const userId = localStorage.getItem('userId');

  const fetchNotifications = () => {
    if (userId) {
      getNotifications(userId)
        .then(data => setNotifications(data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => fetchNotifications(), []);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SimplePage icon={Bell} title="Notifications" description="All your notifications in one place">
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif._id} onClick={() => !notif.isRead && markAsRead(notif._id)} className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow ${notif.isRead ? 'opacity-70' : 'cursor-pointer'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'success' ? 'bg-[#05CD99]' : notif.type === 'warning' ? 'bg-[#FFB547]' : 'bg-[#0B4DA2]'}`} />
              <div className="flex-1">
                <h4 className={`font-bold text-[#1B254B] mb-1 ${notif.isRead ? 'font-normal' : ''}`}>{notif.title}</h4>
                <p className="text-sm text-[#A3AED0]">{notif.message}</p>
                <p className="text-xs text-[#A3AED0] mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
              {!notif.isRead && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">New</span>}
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p className="text-gray-400 py-8 text-center bg-white rounded-2xl">You have no notifications.</p>}
      </div>
    </SimplePage>
  );
};
