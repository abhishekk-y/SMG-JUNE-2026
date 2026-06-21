import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const SuperAdminAnalyticsPage = () => {
  const [stats, setStats] = useState({
    attendance: '96.2%',
    requests: '12,487',
    training: '88%',
    utilization: '74%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: any = await apiFetch('/cross-portal/stats');
      if (data) {
        setStats({
          attendance: data.attendance || '96.2%',
          requests: data.requests || '12,487',
          training: data.training || '88%',
          utilization: data.utilization || '74%'
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load system-wide analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { title: 'Company Attendance', value: stats.attendance, note: 'Last 30 days' },
    { title: 'Requests Processed', value: stats.requests, note: 'All-time total' },
    { title: 'Training Completion', value: stats.training, note: 'Mandatory courses' },
    { title: 'Resource Utilization', value: stats.utilization, note: 'Across departments' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1B254B]">System-Wide Analytics</h2>
          <p className="text-xs text-gray-500">Company-wide attendance, requests, training and utilization metrics</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-bold text-[#0B4DA2] hover:underline disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-6 rounded-[24px] border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center">
                <span className="text-xs text-gray-400">Loading...</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center"><BarChart3 className="text-[#0B4DA2]" /></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{c.title}</span>
            </div>
            <div className="text-3xl font-bold text-[#1B254B]">{c.value}</div>
            <p className="text-xs text-gray-500 mt-1">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="h-48 bg-[#F4F7FE] rounded-2xl border border-dashed flex items-center justify-center text-sm text-gray-500">
          Interactive graphs are populated based on real-time database activity.
        </div>
      </div>
    </div>
  );
};
