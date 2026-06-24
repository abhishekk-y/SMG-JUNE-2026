import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { getDeptStore, setDeptStore } from '../../services/api';

export const SuperAdminSettingsPage = () => {
  const [multiLevel, setMultiLevel] = useState(false);
  const [requireComments, setRequireComments] = useState(false);
  const [enforcePassword, setEnforcePassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const data: any = await getDeptStore('system_settings');
      if (Array.isArray(data) && data.length > 0) {
        const config = data[0];
        setMultiLevel(!!config.multiLevel);
        setRequireComments(!!config.requireComments);
        setEnforcePassword(!!config.enforcePassword);
        setTwoFactor(!!config.twoFactor);
      }
    } catch (err: any) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to load system settings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const config = {
        key: 'settings',
        multiLevel,
        requireComments,
        enforcePassword,
        twoFactor
      };
      await setDeptStore('system_settings', [config], 'Administration');
      setMsg({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err: any) {
      console.error(err);
      setMsg({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1B254B]">System Settings</h2>
          <p className="text-xs text-gray-500">Configure approval workflows, security policies and catalogs</p>
        </div>
        <button
          onClick={fetchSettings}
          disabled={loading || saving}
          className="flex items-center gap-2 text-sm font-bold text-[#0B4DA2] hover:underline disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border text-sm font-bold ${
          msg.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center rounded-[24px]">
              <span className="text-xs text-gray-400">Loading settings...</span>
            </div>
          )}
          <h3 className="font-bold text-[#1B254B] mb-4 text-base">Approval Workflows</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={multiLevel}
                onChange={(e) => setMultiLevel(e.target.checked)}
                className="w-4 h-4 text-[#0B4DA2] border-gray-300 rounded focus:ring-[#0B4DA2]"
              />
              <span>Enable multi-level approvals</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={requireComments}
                onChange={(e) => setRequireComments(e.target.checked)}
                className="w-4 h-4 text-[#0B4DA2] border-gray-300 rounded focus:ring-[#0B4DA2]"
              />
              <span>Require comments on rejection</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center rounded-[24px]">
              <span className="text-xs text-gray-400">Loading settings...</span>
            </div>
          )}
          <h3 className="font-bold text-[#1B254B] mb-4 text-base">Security Policies</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enforcePassword}
                onChange={(e) => setEnforcePassword(e.target.checked)}
                className="w-4 h-4 text-[#0B4DA2] border-gray-300 rounded focus:ring-[#0B4DA2]"
              />
              <span>Enforce strong passwords</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 text-[#0B4DA2] border-gray-300 rounded focus:ring-[#0B4DA2]"
              />
              <span>Two-factor authentication (2FA)</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-bold text-[#1B254B] mb-2 text-base">Service Catalogs</h3>
          <p className="text-sm text-gray-600 mb-4">Manage canteen, transport, SIM, uniform and welfare services.</p>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading || saving}
              className="bg-[#0B4DA2] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#042A5B] transition-colors disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button className="bg-gray-100 text-[#1B254B] px-5 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              onClick={() => alert('Catalog Manager: Service catalogs (Canteen, Transport, Uniform, SIM, Welfare) are managed through their respective Department Portals. Navigate to the department portal to add/edit/remove catalog items.')}>
              Open Catalog Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
