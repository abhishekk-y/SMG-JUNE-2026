import React, { useState, useEffect } from 'react';
import { Home, Calendar, MapPin, Users, Star, Clock, CheckCircle, Loader2, X, AlertCircle } from 'lucide-react';
import { getGuestHouseBookings, bookGuestHouse } from '../services/api';

export const GuestHousePage = () => {
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [searched, setSearched] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState<any>(null);
  const [purpose, setPurpose] = useState('');
  const userId = localStorage.getItem('userId');

  const guestHouses = [
    { id: 1, name: 'Executive Suite', location: 'Noida Sector 62', capacity: 2, price: 1200, rating: 4.5, amenities: ['WiFi', 'AC', 'TV', 'Breakfast'], available: true },
    { id: 2, name: 'Deluxe Room', location: 'Greater Noida', capacity: 3, price: 800, rating: 4.3, amenities: ['WiFi', 'AC', 'TV'], available: true },
    { id: 3, name: 'Standard Room', location: 'Noida Sector 18', capacity: 2, price: 600, rating: 4.0, amenities: ['WiFi', 'Fan'], available: false },
    { id: 4, name: 'Family Suite', location: 'Noida Sector 62', capacity: 4, price: 1500, rating: 4.7, amenities: ['WiFi', 'AC', 'TV', 'Breakfast', 'Kitchenette'], available: true },
  ];

  useEffect(() => {
    if (userId) {
      getGuestHouseBookings(userId)
        .then(data => setBookings(data))
        .catch(() => setBookings([]));
    }
  }, [userId]);

  const handleBookNow = (house: any) => {
    setShowBookingModal(house);
    setPurpose('');
  };

  const handleConfirmBooking = async () => {
    if (!userId) { alert('Please log in first'); return; }
    if (!selectedDates.checkIn || !selectedDates.checkOut) { alert('Please select check-in and check-out dates'); return; }
    if (!purpose.trim()) { alert('Please enter the purpose of visit'); return; }

    setIsBooking(true);
    try {
      const roomTypeMap: Record<string, string> = {
       'Executive Suite': 'Suite',
       'Standard Room': 'Single',
       'Deluxe Room': 'Double',
       'Dormitory': 'Dormitory',
     };

     const bookingData = {
       user: userId,
       bookingId: `GH-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
       guestName: localStorage.getItem('userName') || localStorage.getItem('userId') || 'Guest',
       roomType: roomTypeMap[showBookingModal.name] || 'Single',
       checkInDate: selectedDates.checkIn,
       checkOutDate: selectedDates.checkOut,
       numberOfGuests: guests,
       purpose: purpose,
       status: 'Pending',
     };
      
      const newBooking = await bookGuestHouse(bookingData);
      setBookings([newBooking, ...bookings]);
      setShowBookingModal(null);
      setSelectedDates({ checkIn: '', checkOut: '' });
      setPurpose('');
      setBookingSuccess(`Booking for ${bookingData.roomType} confirmed!`);
      setTimeout(() => setBookingSuccess(''), 4000);
    } catch (err: any) {
      console.error('Booking error:', err);
      alert(err.message || 'Server connection failed.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {bookingSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle className="text-green-500" size={24} />
          <p className="font-bold text-green-700">{bookingSuccess}</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-white mb-2 flex items-center gap-3"><Home size={32} /> Guest House Booking</h1>
        <p className="text-[#87CEEB] opacity-90">Reserve comfortable accommodations for official visits</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4">Search Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-[#A3AED0] mb-2 block">Check-in</label>
            <input type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" 
              value={selectedDates.checkIn} onChange={(e) => setSelectedDates({...selectedDates, checkIn: e.target.value})}
              min={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="text-sm text-[#A3AED0] mb-2 block">Check-out</label>
            <input type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none"
              value={selectedDates.checkOut} onChange={(e) => setSelectedDates({...selectedDates, checkOut: e.target.value})}
              min={selectedDates.checkIn || new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="text-sm text-[#A3AED0] mb-2 block">Guests</label>
            <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none"
              value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4+ Guests</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              className="w-full bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors"
              onClick={() => {
                if (!selectedDates.checkIn || !selectedDates.checkOut) {
                  alert('Please select check-in and check-out dates');
                  return;
                }
                setSearched(true);
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {guestHouses.filter(house => {
          if (!searched) return true;
          return house.available && house.capacity >= guests;
        }).map(house => (        
          <div key={house.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[#1B254B] mb-1">{house.name}</h3>
                <div className="flex items-center gap-3 text-sm text-[#A3AED0]">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {house.location}</span>
                  <span className="flex items-center gap-1"><Users size={14} /> {house.capacity} Guests</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-yellow-700">{house.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {house.amenities.map((amenity, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-[#0B4DA2] text-xs font-bold rounded-lg">
                  {amenity}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-[#A3AED0]">Per Night</p>
                <p className="text-2xl font-bold text-[#0B4DA2]">₹{house.price}</p>
              </div>
              <button 
                disabled={!house.available}
                onClick={() => house.available && handleBookNow(house)}
                className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                  house.available 
                    ? 'bg-[#0B4DA2] text-white hover:bg-[#042A5B]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {house.available ? 'Book Now' : 'Not Available'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBookingModal(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in slide-in-from-bottom-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1B254B]">Confirm Booking</h3>
              <button onClick={() => setShowBookingModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="font-bold text-[#1B254B]">{showBookingModal.name}</p>
                <p className="text-sm text-[#A3AED0]">{showBookingModal.location} • ₹{showBookingModal.price}/night</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Check-in *</label>
                  <input type="date" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm"
                    value={selectedDates.checkIn} onChange={(e) => setSelectedDates({...selectedDates, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Check-out *</label>
                  <input type="date" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm"
                    value={selectedDates.checkOut} onChange={(e) => setSelectedDates({...selectedDates, checkOut: e.target.value})}
                    min={selectedDates.checkIn || new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Purpose of Visit *</label>
                <input type="text" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm"
                  placeholder="e.g., Client visit, Training program..."
                  value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              </div>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking || !selectedDates.checkIn || !selectedDates.checkOut || !purpose.trim()}
                className="w-full bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isBooking ? <><Loader2 size={18} className="animate-spin" /> Booking...</> : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Bookings from Database */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4 flex items-center gap-2"><Clock size={20} /> My Bookings</h3>
        <div className="space-y-3">
          {bookings.length > 0 ? bookings.map((booking: any) => (
            <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-[#1B254B]">{booking.roomType}</p>
                <p className="text-sm text-[#A3AED0] flex items-center gap-1 mt-1">
                  <Calendar size={14} />
                  {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'}) : '-'}
                  {' → '}
                  {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('en-IN', {month: 'short', day: 'numeric', year: 'numeric'}) : '-'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#1B254B]">₹{booking.pricePerNight || 0}/night</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  booking.status === 'Approved' || booking.status === 'Confirmed' ? 'bg-green-50 text-[#05CD99]' :
                  booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-blue-50 text-[#0B4DA2]'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-[#A3AED0]">
              <Home size={32} className="mx-auto mb-2 opacity-30" />
              <p>No bookings yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
