import React, { useState, useEffect } from 'react';
import {
  Shirt,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  AlertCircle,
  ChevronDown,
  X,
  RefreshCw
} from 'lucide-react';
import { getUniformRequests, requestUniform } from '../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const UNIFORM_CATALOGUE = [
  {
    id: 'shirt',
    name: 'Work Shirt',
    description: 'Official SMG Electric work shirt with company logo',
    icon: '👔',
    color: 'from-blue-500 to-blue-700',
    light: 'bg-blue-50 border-blue-200',
    badge: 'text-blue-700'
  },
  {
    id: 'trouser',
    name: 'Safety Trousers',
    description: 'Heavy-duty, flame-resistant work trousers',
    icon: '👖',
    color: 'from-slate-500 to-slate-700',
    light: 'bg-slate-50 border-slate-200',
    badge: 'text-slate-700'
  },
  {
    id: 'jacket',
    name: 'Safety Jacket',
    description: 'Hi-visibility safety jacket for plant floor operations',
    icon: '🧥',
    color: 'from-orange-500 to-orange-700',
    light: 'bg-orange-50 border-orange-200',
    badge: 'text-orange-700'
  },
  {
    id: 'boots',
    name: 'Safety Boots',
    description: 'Steel-toe cap safety boots (ISO 20345)',
    icon: '🥾',
    color: 'from-amber-600 to-amber-800',
    light: 'bg-amber-50 border-amber-200',
    badge: 'text-amber-700'
  },
  {
    id: 'gloves',
    name: 'Work Gloves',
    description: 'Cut-resistant safety gloves for assembly operations',
    icon: '🧤',
    color: 'from-green-500 to-green-700',
    light: 'bg-green-50 border-green-200',
    badge: 'text-green-700'
  },
  {
    id: 'helmet',
    name: 'Safety Helmet',
    description: 'ISI-certified hard hat for floor and construction areas',
    icon: '⛑️',
    color: 'from-yellow-500 to-yellow-600',
    light: 'bg-yellow-50 border-yellow-200',
    badge: 'text-yellow-700'
  },
];

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Pending:   { icon: Clock,        color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',  label: 'Pending Review' },
  Approved:  { icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50 border-green-200',  label: 'Approved' },
  Dispatched:{ icon: Truck,        color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',    label: 'Dispatched' },
  Delivered: { icon: Package,      color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200',label: 'Delivered' },
  Rejected:  { icon: XCircle,      color: 'text-red-600',    bg: 'bg-red-50 border-red-200',      label: 'Rejected' },
};

// ─── New Request Modal ─────────────────────────────────────────────────────────
function NewRequestModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'catalogue' | 'details'>('catalogue');
  const [selectedItem, setSelectedItem] = useState<(typeof UNIFORM_CATALOGUE)[0] | null>(null);
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSelectItem = (item: typeof UNIFORM_CATALOGUE[0]) => {
    setSelectedItem(item);
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    setError('');
    try {
      const userId = localStorage.getItem('userId');
      await requestUniform({
        user: userId,
        items: [{ name: selectedItem.name, size, quantity }],
        reason: reason || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042A5B] to-[#0B4DA2] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">New Uniform Request</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              {step === 'catalogue' ? 'Select the item you need' : `Configure your ${selectedItem?.name}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
            <X size={20} />
          </button>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0">
          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${step === 'catalogue' ? 'bg-[#0B4DA2]' : 'bg-green-500'}`} />
          <div className="w-8 h-0.5 bg-gray-300" />
          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${step === 'details' ? 'bg-[#0B4DA2]' : 'bg-gray-300'}`} />
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {step === 'catalogue' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {UNIFORM_CATALOGUE.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="text-left group p-5 rounded-2xl border-2 border-gray-100 hover:border-[#0B4DA2] hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 bg-white"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-[#1B254B] mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected item preview */}
              <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${selectedItem?.light}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedItem?.color} flex items-center justify-center text-3xl shadow-md flex-shrink-0`}>
                  {selectedItem?.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#1B254B]">{selectedItem?.name}</h3>
                  <p className="text-sm text-gray-500">{selectedItem?.description}</p>
                </div>
                <button onClick={() => setStep('catalogue')} className="ml-auto text-xs text-[#0B4DA2] font-bold hover:underline">
                  Change
                </button>
              </div>

              {/* Size selector */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-3">Select Size</label>
                <div className="flex flex-wrap gap-3">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-14 h-14 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
                        size === s
                          ? 'bg-[#0B4DA2] text-white border-[#0B4DA2] shadow-lg scale-105'
                          : 'bg-white text-[#1B254B] border-gray-200 hover:border-[#0B4DA2] hover:text-[#0B4DA2]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">If unsure, refer to the SMG Size Guide in Company Policies.</p>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 text-[#1B254B] font-bold text-xl hover:border-[#0B4DA2] hover:text-[#0B4DA2] transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-xl font-bold text-[#1B254B]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(5, q + 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 text-[#1B254B] font-bold text-xl hover:border-[#0B4DA2] hover:text-[#0B4DA2] transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-400">(max 5 per request)</span>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Reason / Remarks <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g., Replacement due to wear and tear..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'details' && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50">
            <div className="text-sm text-gray-500">
              <span className="font-bold text-[#1B254B]">{selectedItem?.name}</span> · Size <span className="font-bold text-[#0B4DA2]">{size}</span> · Qty <span className="font-bold text-[#0B4DA2]">{quantity}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#042A5B] to-[#0B4DA2] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg"
            >
              {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Request Card ──────────────────────────────────────────────────────────────
function RequestCard({ req }: { req: any }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG['Pending'];
  const StatusIcon = cfg.icon;
  const firstItem = req.items?.[0];

  const catalogItem = UNIFORM_CATALOGUE.find(c =>
    c.name.toLowerCase().includes((firstItem?.name || '').toLowerCase().split(' ')[0])
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${catalogItem?.color || 'from-gray-400 to-gray-600'} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
              {catalogItem?.icon || '👕'}
            </div>
            <div>
              <h4 className="font-bold text-[#1B254B]">
                {req.items?.map((i: any) => i.name).join(', ') || 'Uniform Item'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {req.requestId} · {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${cfg.bg} ${cfg.color} flex-shrink-0`}>
            <StatusIcon size={13} />
            {cfg.label}
          </span>
        </div>

        {/* Quick tags */}
        {firstItem && (
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="px-2.5 py-1 bg-[#F4F7FE] rounded-lg text-xs font-bold text-[#0B4DA2]">Size: {firstItem.size}</span>
            <span className="px-2.5 py-1 bg-[#F4F7FE] rounded-lg text-xs font-bold text-[#0B4DA2]">Qty: {firstItem.quantity}</span>
            {req.deliveryDate && (
              <span className="px-2.5 py-1 bg-purple-50 rounded-lg text-xs font-bold text-purple-700">
                Delivery: {new Date(req.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
            )}
          </div>
        )}

        {/* Expand toggle */}
        {req.items?.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-[#0B4DA2] font-bold hover:underline"
          >
            {expanded ? 'Hide items' : `+${req.items.length - 1} more item(s)`}
            <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}

        {expanded && req.items?.slice(1).map((item: any, i: number) => (
          <div key={i} className="mt-2 flex items-center gap-2 text-sm text-gray-600 pl-2 border-l-2 border-[#0B4DA2]/30">
            <span className="font-medium">{item.name}</span>
            <span className="text-gray-400">·</span>
            <span>Size {item.size}</span>
            <span className="text-gray-400">·</span>
            <span>Qty {item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Status progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className={`h-full rounded-full transition-all ${
            req.status === 'Pending' ? 'w-1/4 bg-amber-400' :
            req.status === 'Approved' ? 'w-2/4 bg-blue-500' :
            req.status === 'Dispatched' ? 'w-3/4 bg-indigo-500' :
            req.status === 'Delivered' ? 'w-full bg-green-500' :
            'w-1/4 bg-red-400'
          }`}
        />
      </div>
    </div>
  );
}

// ─── Main UniformPage ──────────────────────────────────────────────────────────
export const UniformPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const userId = localStorage.getItem('userId');

  const fetchRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUniformRequests(userId);
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const statuses = ['All', 'Pending', 'Approved', 'Dispatched', 'Delivered', 'Rejected'];
  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    delivered: requests.filter(r => r.status === 'Delivered').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20">
                <Shirt size={36} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Uniform Requests</h1>
                <p className="text-blue-200 mt-1 text-sm">Request, track, and manage your official SMG Electric workwear</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-white text-[#042A5B] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex-shrink-0"
            >
              <Plus size={20} /> New Request
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Requests', value: stats.total, icon: '📋' },
              { label: 'Pending', value: stats.pending, icon: '⏳' },
              { label: 'Approved', value: stats.approved, icon: '✅' },
              { label: 'Delivered', value: stats.delivered, icon: '📦' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-blue-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex gap-1 flex-wrap">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === s
                ? 'bg-[#0B4DA2] text-white shadow'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {s}
            {s !== 'All' && requests.filter(r => r.status === s).length > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filter === s ? 'bg-white/20' : 'bg-gray-100'}`}>
                {requests.filter(r => r.status === s).length}
              </span>
            )}
          </button>
        ))}
        <button onClick={fetchRequests} className="ml-auto p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-[#0B4DA2] transition-colors" title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="text-6xl mb-4">👔</div>
          <h3 className="text-xl font-bold text-[#1B254B] mb-2">
            {filter === 'All' ? 'No Requests Yet' : `No ${filter} Requests`}
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            {filter === 'All'
              ? "You haven't submitted any uniform requests. Click 'New Request' to get started."
              : `You don't have any ${filter.toLowerCase()} uniform requests.`}
          </p>
          {filter === 'All' && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors"
            >
              <Plus size={18} /> New Request
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(req => <RequestCard key={req._id} req={req} />)}
        </div>
      )}

      {/* Uniform Catalogue Reference */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
          <Shirt size={20} className="text-[#0B4DA2]" />
          Available Uniform Items
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {UNIFORM_CATALOGUE.map(item => (
            <button
              key={item.id}
              onClick={() => setShowModal(true)}
              className="group text-center p-4 rounded-2xl border-2 border-gray-100 hover:border-[#0B4DA2] hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-2 shadow group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="text-xs font-bold text-[#1B254B]">{item.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <NewRequestModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
};
