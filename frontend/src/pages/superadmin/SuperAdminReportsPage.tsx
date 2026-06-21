import React from 'react';
import { FolderOpen, Download } from 'lucide-react';

export const SuperAdminReportsPage = () => {
  const reports = [
    { id: 'R-ATT-DEC', title: 'Attendance Report (Dec 2025)', size: '2.3 MB' },
    { id: 'R-REQ-YTD', title: 'Requests Year-To-Date', size: '1.1 MB' },
    { id: 'R-TRN-Q4', title: 'Training Effectiveness Q4', size: '980 KB' },
  ];

  const handleDownload = (id: string) => {
    // BUG-023 FIX: Wired report downloads to the backend PDF generation route
    const url = `http://localhost:5000/api/pdf/report/${id}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1B254B]">Reports & Export</h2>
        <p className="text-xs text-gray-500">Generate company reports, export data and audit logs</p>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F4F7FE]">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-bold text-[#0B4DA2]">{r.id}</td>
                <td className="px-6 py-3 text-sm text-[#1B254B]">{r.title}</td>
                <td className="px-6 py-3 text-sm">{r.size}</td>
                <td className="px-6 py-3 text-sm">
                  <button
                    onClick={() => handleDownload(r.id)}
                    className="bg-[#0B4DA2] hover:bg-[#042A5B] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <Download size={14} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
