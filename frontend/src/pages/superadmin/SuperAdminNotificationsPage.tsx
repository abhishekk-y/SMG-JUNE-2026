import React, { useState, useEffect } from 'react';
import { Bell, Send, X } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const SuperAdminNotificationsPage = () => {
  const [audience, setAudience] = useState('All Employees');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [dept, setDept] = useState('');
  const [attachmentBase64, setAttachmentBase64] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load departments for the dropdown
    apiFetch('/departments')
      .then((data: any) => {
        if (Array.isArray(data)) setDepartments(data);
      })
      .catch(console.error);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      alert('Please fill out Title and Message fields.');
      return;
    }
    if (audience === 'By Department' && !dept) {
      alert('Please select a department.');
      return;
    }

    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const response: any = await apiFetch('/notifications/broadcast', {
        method: 'POST',
        body: JSON.stringify({
          audience,
          title,
          message,
          department: audience === 'By Department' ? dept : undefined,
          attachment: attachmentBase64 || undefined
        })
      });

      setSuccessMsg(response.message || 'Notification broadcasted successfully!');
      setTitle('');
      setMessage('');
      setAttachmentBase64('');
      setAttachmentName('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send notification broadcast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1B254B]">Broadcast Notifications</h2>
        <p className="text-xs text-gray-500">Send company-wide announcements and targeted messages</p>
      </div>

      <form onSubmit={handleSend} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
        {successMsg && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-green-700 text-sm font-bold">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-600 text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-600 font-bold block mb-1">Audience</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl bg-[#F4F7FE] outline-none focus:border-[#0B4DA2]"
          >
            <option>All Employees</option>
            <option>Admins only</option>
            <option>By Department</option>
          </select>
        </div>

        {audience === 'By Department' && (
          <div>
            <label className="text-sm text-gray-600 font-bold block mb-1">Select Department</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl bg-[#F4F7FE] outline-none focus:border-[#0B4DA2]"
            >
              <option value="">-- Choose Department --</option>
              {departments.map((d: any) => (
                <option key={d._id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-sm text-gray-600 font-bold block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl bg-[#F4F7FE] outline-none focus:border-[#0B4DA2]"
            placeholder="Notification title"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 font-bold block mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl bg-[#F4F7FE] outline-none focus:border-[#0B4DA2]"
            rows={5}
            placeholder="Write your message"
            required
          />
        </div>

        {/* Attachment */}
        <div>
          <label className="text-sm text-gray-600 font-bold block mb-1">Attachment (Image/PDF)</label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-[#F4F7FE] border border-gray-200 text-[#1B254B] px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors inline-block">
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
                type="button"
                onClick={() => { setAttachmentBase64(''); setAttachmentName(''); }}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove Attachment"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#0B4DA2] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#042A5B] disabled:opacity-50"
        >
          <Bell size={16} /> <Send size={16} /> {loading ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
    </div>
  );
};
