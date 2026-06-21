import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Clock, Calendar, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getTransportRequests, requestTransport } from '../services/api';

export const TransportPage = () => {
  const [transportRequests, setTransportRequests] = useState<any[]>([]);
  const [isRequesting, setIsRequesting] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    type: 'Pick-up',
    from: '',
    to: '',
    date: '',
    time: '',
    passengers: 1,
    purpose: '',
    vehicleType: 'Car'
  });

  const routes = [
    { id: 'r1', name: 'Route A - Noida Sector 62', timing: '8:00 AM - 6:00 PM', capacity: '45 seats', available: 12, status: 'Active' },
    { id: 'r2', name: 'Route B - Greater Noida', timing: '7:30 AM - 5:30 PM', capacity: '45 seats', available: 5, status: 'Active' },
    { id: 'r3', name: 'Route C - Delhi NCR', timing: '9:00 AM - 7:00 PM', capacity: '45 seats', available: 0, status: 'Full' },
    { id: 'r4', name: 'Route D - Ghaziabad', timing: '8:30 AM - 6:30 PM', capacity: '45 seats', available: 18, status: 'Active' },
  ];

  useEffect(() => {
    if (userId) {
      getTransportRequests(userId)
        .then(data => setTransportRequests(data))
        .catch(() => setTransportRequests([]));
    }
  }, [userId]);

  const handleRequestSeat = async (route: any) => {
    if (!userId) { alert('Please log in first'); return; }
    setIsRequesting(route.id);
    try {
      const requestData = {
        user: userId,
        requestId: `TR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        type: 'Pick-up',
        from: 'Office',
        to: route.name,
        date: new Date().toISOString(),
        time: route.timing?.split(' - ')[0] || '08:00',
        purpose: `Daily commute - ${route.name}`,
        status: 'Pending',
      };
      const newRequest = await requestTransport(requestData);
      setTransportRequests([newRequest, ...transportRequests]);
      setSuccessMessage(`Seat requested on ${route.name}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Transport request error:', err);
      alert(err.message || 'Server connection failed.');
    } finally {
      setIsRequesting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) { alert('Please log in first'); return; }
    if (!formData.from || !formData.to || !formData.date || !formData.time) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsRequesting(1);
    try {
      const requestData = {
        user: userId,
        requestId: `TR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        ...formData,
        status: 'Pending',
      };
      const newRequest = await requestTransport(requestData);
      setTransportRequests([newRequest, ...transportRequests]);
      setSuccessMessage('Transport request submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setFormData({ type: 'Pick-up', from: '', to: '', date: '', time: '', passengers: 1, purpose: '', vehicleType: 'Car' });
    } catch (err: any) {
      console.error('Transport request error:', err);
      alert(err.message || 'Server connection failed.');
    } finally {
      setIsRequesting(null);
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle className="text-green-500" size={24} />
          <p className="font-bold text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-white mb-2 flex items-center gap-3"><Bus size={32} /> Transport Service</h1>
        <p className="text-[#87CEEB] opacity-90">Book and manage your office transportation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <Bus className="text-[#0B4DA2] mb-3" size={28} />
          <h4 className="text-[#1B254B] mb-1">Active Vehicles</h4>
          <p className="text-3xl font-bold text-[#0B4DA2]">24</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <CheckCircle className="text-[#05CD99] mb-3" size={28} />
          <h4 className="text-[#1B254B] mb-1">My Requests</h4>
          <p className="text-xl font-bold text-[#1B254B]">{transportRequests.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <Clock className="text-[#FFB547] mb-3" size={28} />
          <h4 className="text-[#1B254B] mb-1">Pick-up Time</h4>
          <p className="text-xl font-bold text-[#1B254B]">8:15 AM</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-6">Available Routes</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {routes.map(route => (
            <div key={route.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#0B4DA2] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-[#1B254B] font-bold mb-2">{route.name}</h4>
                  <div className="space-y-2 text-sm text-[#A3AED0]">
                    <p className="flex items-center gap-2"><Clock size={16} /> {route.timing}</p>
                    <p className="flex items-center gap-2"><Users size={16} /> {route.capacity}</p>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} /> 
                      {route.available > 0 ? `${route.available} seats available` : 'Fully Booked'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  route.status === 'Active' ? 'bg-green-50 text-[#05CD99]' : 'bg-red-50 text-[#EE5D50]'
                }`}>
                  {route.status}
                </span>
              </div>
              <button 
                disabled={route.available === 0 || isRequesting === route.id}
                onClick={() => handleRequestSeat(route)}
                className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                  route.available > 0 
                    ? 'bg-[#0B4DA2] text-white hover:bg-[#042A5B]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isRequesting === route.id ? (
                  <><Loader2 size={18} className="animate-spin" /> Requesting...</>
                ) : (
                  route.available > 0 ? 'Request Seat' : 'Not Available'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-6">Request Transport</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1B254B]">Request Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none">
              <option value="Pick-up">Pick-up</option>
              <option value="Drop">Drop</option>
              <option value="Round Trip">Round Trip</option>
              <option value="Outstation">Outstation</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1B254B]">Vehicle Type</label>
            <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none">
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1B254B]">From</label>
            <input type="text" value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none" placeholder="Pickup Location" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1B254B]">To</label>
            <input type="text" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none" placeholder="Drop Location" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1B254B]">Date</label>
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1B254B]">Time</label>
            <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1B254B]">Passengers</label>
            <input type="number" min="1" value={formData.passengers} onChange={e => setFormData({...formData, passengers: parseInt(e.target.value)})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1B254B]">Purpose</label>
            <input type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none" placeholder="e.g. Client Meeting" required />
          </div>
          <div className="col-span-1 md:col-span-2 pt-2">
            <button disabled={isRequesting !== null} type="submit" className="w-full md:w-auto px-8 py-3 bg-[#0B4DA2] hover:bg-[#042A5B] text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              {isRequesting ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

      {/* Transport Requests from Database */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4">My Transport Requests</h3>
        <div className="space-y-3">
          {transportRequests.length > 0 ? transportRequests.map((request: any) => (
            <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-[#1B254B]">{request.type}: {request.from} → {request.to}</p>
                <p className="text-sm text-[#A3AED0] mt-1 flex items-center gap-2">
                  <Calendar size={14} /> {request.date ? new Date(request.date).toLocaleDateString() : '-'} 
                  <Clock size={14} className="ml-2" /> {request.time || '-'}
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                request.status === 'Approved' ? 'bg-green-50 text-[#05CD99]' :
                request.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                'bg-blue-50 text-[#0B4DA2]'
              }`}>
                {request.status}
              </span>
            </div>
          )) : (
            <div className="text-center py-8 text-[#A3AED0]">
              <Bus size={32} className="mx-auto mb-2 opacity-30" />
              <p>No transport requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
