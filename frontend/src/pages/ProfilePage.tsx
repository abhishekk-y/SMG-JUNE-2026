import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Award, Edit, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContextEnhanced';
import { getUser, updateUser } from '../services/api';

export const ProfilePage = () => {
  const { currentUser } = useApp();
  const userId = localStorage.getItem('userId');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      getUser(userId)
        .then(data => {
          if (data) setFormData(data);
          else setFormData(currentUser || {});
        })
        .catch(() => setFormData(currentUser || {}));
    }
  }, [userId, currentUser]);

  if (!formData) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}&backgroundColor=b6e3f4`} alt={formData.name} className="w-24 h-24 rounded-2xl border-4 border-white/20 bg-white" />
            <div>
              <h1 className="text-white mb-2">{formData.name}</h1>
              <p className="text-[#87CEEB] opacity-90">{formData.role || 'Employee'} • {formData.dept || 'General'}</p>
              <p className="text-sm text-white/70 mt-1">Employee ID: {formData.empId || 'N/A'}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-[#0B4DA2] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            {isEditing ? <><X size={20} /> Cancel</> : <><Edit size={20} /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Phone Number</label>
                <input 
                  type="tel" 
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Date of Birth</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Address</label>
                <textarea 
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
            </div>
            {isEditing && (
              <button 
                onClick={async () => {
                  try {
                    const id = formData._id || localStorage.getItem('userId');
                    await updateUser(id, formData);
                    alert('Profile updated successfully!');
                    setIsEditing(false);
                  } catch(e: any) { 
                    alert(e.message || 'Server error'); 
                  }
                }}
                className="mt-6 bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center gap-2"
              >
                <Save size={20} /> Save Changes
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Briefcase className="text-[#0B4DA2] mt-1" size={20} />
                <div>
                  <p className="text-sm text-[#A3AED0]">Department</p>
                  <p className="font-bold text-[#1B254B]">{formData.dept || 'General'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-[#0B4DA2] mt-1" size={20} />
                <div>
                  <p className="text-sm text-[#A3AED0]">Date of Joining</p>
                  <p className="font-bold text-[#1B254B]">{formData.dateOfJoining || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-[#0B4DA2] mt-1" size={20} />
                <div>
                  <p className="text-sm text-[#A3AED0]">Reporting To</p>
                  <p className="font-bold text-[#1B254B]">{formData.reportingTo || 'Unassigned'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="text-[#0B4DA2] mt-1" size={20} />
                <div>
                  <p className="text-sm text-[#A3AED0]">Shift Timing</p>
                  <p className="font-bold text-[#1B254B]">{formData.shift || 'Standard'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Education</h3>
            <div className="space-y-4">
              {(formData.education || []).map((edu: any, idx: number) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-bold text-[#1B254B]">{edu.degree}</p>
                  <p className="text-sm text-[#A3AED0]">{edu.institution} • {edu.year}</p>
                  <p className="text-sm text-[#0B4DA2] mt-1">Grade: {edu.grade}</p>
                </div>
              ))}
              {!(formData.education?.length) && <p className="text-gray-400 text-sm">No education details added.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-[#0B4DA2] mb-1">Status</p>
                <p className="text-2xl font-bold text-[#0B4DA2]">Active</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-[#05CD99] mb-1">Profile Completeness</p>
                <p className="text-2xl font-bold text-[#05CD99]">90%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(formData.skills || []).map((skill: string, idx: number) => (
                <span key={idx} className="px-3 py-2 bg-blue-50 text-[#0B4DA2] text-sm font-bold rounded-lg">
                  {skill}
                </span>
              ))}
              {!(formData.skills?.length) && <p className="text-gray-400 text-sm">No skills added.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Certifications</h3>
            <div className="space-y-3">
              {(formData.certifications || []).map((cert: any, idx: number) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-bold text-[#1B254B] text-sm">{cert.name}</p>
                  <p className="text-xs text-[#A3AED0] mt-1">{cert.issuer} • {cert.year}</p>
                </div>
              ))}
              {!(formData.certifications?.length) && <p className="text-gray-400 text-sm">No certifications added.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
