import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
// BUG-013 FIX: wire to real getAllRequests() API instead of hardcoded mock data
import { apiFetch } from '../../services/api';

export const SuperAdminRequestsPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // BUG-013 FIX: fetch real data from /requests-all endpoint
      const data: any = await apiFetch('/requests-all');
      if (Array.isArray(data)) setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={14} className="text-green-500" />;
      case 'Rejected': return <XCircle size={14} className="text-red-500" />;
      case 'Pending': return <Clock size={14} className="text-yellow-500" />;
      default: return <AlertCircle size={14} className="text-blue-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700';
      case 'Rejected': return 'bg-red-50 text-red-700';
      case 'Pending': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1B254B]">All Requests</h2>
          <p className="text-xs text-gray-500">Company-wide request oversight and audit trail ({requests.length} total)</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 text-sm font-bold text-[#0B4DA2] hover:underline"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="bg-white p-12 rounded-[24px] shadow-sm border border-gray-100 text-center text-gray-400">
          Loading requests...
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-6 rounded-[24px] border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F4F7FE]">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No requests found</td>
                </tr>
              ) : (
                requests.map((req: any) => (
                  <tr key={req._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-bold text-[#1B254B]">
                      {req.user?.name || 'Unknown'}
                      <span className="block text-xs text-gray-400 font-normal">{req.user?.empId}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{req.type}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{req.user?.dept || '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusClass(req.status)}`}>
                        {getStatusIcon(req.status)} {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
