import React, { useState, useEffect } from 'react';
import {
  Shirt, Plus, Clock, CheckCircle, XCircle, Truck, Package,
  AlertCircle, ChevronDown, X, RefreshCw, Info, Shield,
  HardHat, Footprints, Hand, Layers, ChevronRight, Ban
} from 'lucide-react';
import { getUniformRequests, requestUniform, cancelUniformRequest } from '../services/api';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CATALOGUE = [
  { id: 'shirt',   name: 'Work Shirt',       desc: 'Official SMG work shirt with company logo embroidery',   Icon: Shirt,     color: 'bg-blue-100 text-blue-700',    border: 'border-blue-200' },
  { id: 'trouser', name: 'Safety Trousers',   desc: 'Heavy-duty, flame-resistant trousers for plant floors',  Icon: Layers,    color: 'bg-slate-100 text-slate-700',  border: 'border-slate-200' },
  { id: 'jacket',  name: 'Safety Jacket',     desc: 'Hi-visibility safety jacket — mandatory for plant ops',  Icon: Shield,    color: 'bg-orange-100 text-orange-700',border: 'border-orange-200' },
  { id: 'boots',   name: 'Safety Boots',      desc: 'Steel-toe cap boots, ISO 20345 certified',               Icon: Footprints,color: 'bg-amber-100 text-amber-700',  border: 'border-amber-200' },
  { id: 'gloves',  name: 'Work Gloves',       desc: 'Cut-resistant gloves for assembly line operations',      Icon: Hand,      color: 'bg-green-100 text-green-700',  border: 'border-green-200' },
  { id: 'helmet',  name: 'Safety Helmet',     desc: 'ISI-certified hard hat for floor and construction areas',Icon: HardHat,   color: 'bg-yellow-100 text-yellow-700',border: 'border-yellow-200' },
];

const STATUS_CFG: Record<string, { Icon: React.ElementType; color: string; bg: string; label: string }> = {
  Pending:    { Icon: Clock,        color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',   label: 'Pending Review' },
  Approved:   { Icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50 border-green-200',   label: 'Approved' },
  Dispatched: { Icon: Truck,        color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',     label: 'Dispatched' },
  Delivered:  { Icon: Package,      color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', label: 'Delivered' },
  Rejected:   { Icon: XCircle,      color: 'text-red-600',    bg: 'bg-red-50 border-red-200',       label: 'Rejected / Cancelled' },
};

const PROGRESS: Record<string, number> = { Pending: 25, Approved: 50, Dispatched: 75, Delivered: 100, Rejected: 0 };
const PROGRESS_COLOR: Record<string, string> = { Pending: 'bg-amber-400', Approved: 'bg-blue-500', Dispatched: 'bg-indigo-500', Delivered: 'bg-green-500', Rejected: 'bg-red-300' };

// ─── Modal ──────────────────────────────────────────────────────────────────────
function NewRequestModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'catalogue' | 'details'>('catalogue');
  const [selected, setSelected] = useState<typeof CATALOGUE[0] | null>(null);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true); setError('');
    try {
      await requestUniform({
        user: localStorage.getItem('userId'),
        items: [{ name: selected.name, size, quantity: qty }],
        reason: reason || undefined,
      });
      onSuccess(); onClose();
    } catch (e: any) { setError(e.message || 'Submission failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(4,42,91,0.6)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042A5B] to-[#0B4DA2] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">New Uniform Request</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              {step === 'catalogue' ? 'Step 1 of 2 — Select an item' : `Step 2 of 2 — Configure ${selected?.name}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors"><X size={20} /></button>
        </div>

        {/* Progress */}
        <div className="h-1 bg-blue-100 flex-shrink-0">
          <div className={`h-full bg-[#0B4DA2] transition-all duration-500 ${step === 'catalogue' ? 'w-1/2' : 'w-full'}`} />
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {step === 'catalogue' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATALOGUE.map(item => {
                const Icon = item.Icon;
                return (
                  <button key={item.id} onClick={() => { setSelected(item); setStep('details'); }}
                    className="text-left group p-5 rounded-2xl border-2 border-gray-100 hover:border-[#0B4DA2] hover:shadow-lg transition-all duration-200 bg-white">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#1B254B]">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-[#0B4DA2] flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Preview */}
              {selected && (() => { const Icon = selected.Icon; return (
                <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${selected.border} bg-white`}>
                  <div className={`w-14 h-14 rounded-2xl ${selected.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1B254B]">{selected.name}</h3>
                    <p className="text-sm text-gray-500">{selected.desc}</p>
                  </div>
                  <button onClick={() => setStep('catalogue')} className="text-xs text-[#0B4DA2] font-bold hover:underline flex-shrink-0">Change</button>
                </div>
              ); })()}

              {/* Size */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-3">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`w-14 h-14 rounded-xl font-bold text-sm transition-all border-2 ${size === s ? 'bg-[#0B4DA2] text-white border-[#0B4DA2] shadow-lg scale-105' : 'bg-white text-[#1B254B] border-gray-200 hover:border-[#0B4DA2]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Info size={12} /> Refer to the SMG Size Guide in Company Policies if unsure.
                </p>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-3">Quantity <span className="font-normal text-gray-400">(max 5)</span></label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-xl border-2 border-gray-200 text-[#1B254B] font-bold text-xl hover:border-[#0B4DA2] transition-colors">−</button>
                  <span className="w-12 text-center text-2xl font-bold text-[#1B254B]">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(5, q + 1))} className="w-10 h-10 rounded-xl border-2 border-gray-200 text-[#1B254B] font-bold text-xl hover:border-[#0B4DA2] transition-colors">+</button>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Reason <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="e.g., Replacement due to wear and tear, First-time issuance..."
                  rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm resize-none" />
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
              <span className="font-bold text-[#1B254B]">{selected?.name}</span> &middot; Size <span className="font-bold text-[#0B4DA2]">{size}</span> &middot; Qty <span className="font-bold text-[#0B4DA2]">{qty}</span>
            </div>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#042A5B] to-[#0B4DA2] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg">
              {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Request Card ────────────────────────────────────────────────────────────────
function RequestCard({ req, onRefresh }: { req: any; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const cfg = STATUS_CFG[req.status] || STATUS_CFG['Pending'];
  const StatusIcon = cfg.Icon;
  const firstItem = req.items?.[0];
  const catalogItem = CATALOGUE.find(c => c.name.toLowerCase().includes((firstItem?.name || '').toLowerCase().split(' ')[0]));
  const CatIcon = catalogItem?.Icon || Shirt;

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    setCancelling(true);
    try { await cancelUniformRequest(req._id); onRefresh(); }
    catch { alert('Failed to cancel. Please try again.'); }
    finally { setCancelling(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${catalogItem?.color || 'bg-gray-100 text-gray-600'} flex items-center justify-center flex-shrink-0`}>
              <CatIcon size={22} />
            </div>
            <div>
              <h4 className="font-bold text-[#1B254B]">{req.items?.map((i: any) => i.name).join(', ') || 'Uniform Item'}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{req.requestId} &middot; {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${cfg.bg} ${cfg.color} flex-shrink-0`}>
            <StatusIcon size={13} />{cfg.label}
          </span>
        </div>

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

        {req.items?.length > 1 && (
          <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-xs text-[#0B4DA2] font-bold hover:underline">
            {expanded ? 'Hide' : `+${req.items.length - 1} more item(s)`}
            <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
        {expanded && req.items?.slice(1).map((item: any, i: number) => (
          <div key={i} className="mt-2 flex items-center gap-2 text-sm text-gray-600 pl-2 border-l-2 border-[#0B4DA2]/30">
            <span className="font-medium">{item.name}</span><span className="text-gray-400">&middot;</span>
            <span>Size {item.size}</span><span className="text-gray-400">&middot;</span><span>Qty {item.quantity}</span>
          </div>
        ))}

        {/* Cancel — only for Pending */}
        {req.status === 'Pending' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button onClick={handleCancel} disabled={cancelling}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50">
              {cancelling ? <RefreshCw size={13} className="animate-spin" /> : <Ban size={13} />}
              {cancelling ? 'Cancelling...' : 'Cancel Request'}
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div className={`h-full rounded-full transition-all ${PROGRESS_COLOR[req.status] || 'bg-gray-300'}`}
          style={{ width: `${PROGRESS[req.status] || 0}%` }} />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
export const UniformPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const userId = localStorage.getItem('userId');

  const fetchRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try { setRequests(await getUniformRequests(userId) || []); }
    catch { setRequests([]); }
    finally { setLoading(false); }
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

      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
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
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-white text-[#042A5B] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex-shrink-0">
              <Plus size={20} /> New Request
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Requests', value: stats.total, Icon: Layers },
              { label: 'Pending', value: stats.pending, Icon: Clock },
              { label: 'Approved', value: stats.approved, Icon: CheckCircle },
              { label: 'Delivered', value: stats.delivered, Icon: Package },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
                <s.Icon size={20} className="text-blue-300 mb-2" />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-blue-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info size={18} className="text-[#0B4DA2]" />
          <h3 className="font-bold text-[#0B4DA2]">How to Request Uniform Items</h3>
        </div>
        <ol className="space-y-1.5 text-sm text-gray-600">
          <li className="flex items-start gap-2"><span className="font-bold text-[#0B4DA2] flex-shrink-0">1.</span>Click <strong>New Request</strong> and select the uniform item you require.</li>
          <li className="flex items-start gap-2"><span className="font-bold text-[#0B4DA2] flex-shrink-0">2.</span>Choose your correct size and quantity (maximum 5 items per request).</li>
          <li className="flex items-start gap-2"><span className="font-bold text-[#0B4DA2] flex-shrink-0">3.</span>Your request will be reviewed by your department admin within 2 working days.</li>
          <li className="flex items-start gap-2"><span className="font-bold text-[#0B4DA2] flex-shrink-0">4.</span>Once approved, items will be dispatched to your department. Track status below.</li>
          <li className="flex items-start gap-2"><span className="font-bold text-[#0B4DA2] flex-shrink-0">5.</span>You may cancel a request only while it is in <strong>Pending</strong> status.</li>
        </ol>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex gap-1 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === s ? 'bg-[#0B4DA2] text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
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

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex gap-3"><div className="w-12 h-12 bg-gray-200 rounded-2xl" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/2" /><div className="h-3 bg-gray-200 rounded w-1/3" /></div></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shirt size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#1B254B] mb-2">{filter === 'All' ? 'No Requests Yet' : `No ${filter} Requests`}</h3>
          <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
            {filter === 'All' ? "You haven't submitted any uniform requests. Click 'New Request' to get started." : `You have no ${filter.toLowerCase()} requests at this time.`}
          </p>
          {filter === 'All' && (
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors">
              <Plus size={18} /> New Request
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(req => <RequestCard key={req._id} req={req} onRefresh={fetchRequests} />)}
        </div>
      )}

      {/* Catalogue Reference */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
          <Shirt size={20} className="text-[#0B4DA2]" /> Available Uniform Items
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATALOGUE.map(item => {
            const Icon = item.Icon;
            return (
              <button key={item.id} onClick={() => setShowModal(true)} title={item.desc}
                className="group text-center p-4 rounded-2xl border-2 border-gray-100 hover:border-[#0B4DA2] hover:shadow-md transition-all">
                <div className={`w-12 h-12 mx-auto rounded-2xl ${item.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <p className="text-xs font-bold text-[#1B254B]">{item.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {showModal && <NewRequestModal onClose={() => setShowModal(false)} onSuccess={fetchRequests} />}
    </div>
  );
};
