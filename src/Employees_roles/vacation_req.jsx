import React, { useState, useRef, useEffect } from 'react';
import { Calendar, UploadCloud, X } from 'lucide-react';
import { postVacationRequest } from './employee_role_api'; // <--- new import

export default function VacationRequest({ employee = {}, onClose = () => {}, onSuccess = () => {} }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('ANNUAL');
  const [comments, setComments] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [requestDate, setRequestDate] = useState(() => {
    // default to today in yyyy-mm-dd format
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const fileInputRef = useRef();

  // draggable state
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [useTransformCenter, setUseTransformCenter] = useState(true); // initially center via transform

  useEffect(() => {
    // lock scroll when modal open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const resetForm = () => {
    setRequestDate(new Date().toISOString().slice(0,10));
    setStartDate('');
    setEndDate('');
    setLeaveType('ANNUAL');
    setComments('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };

  const validate = () => {
    if (!startDate || !endDate) {
      alert('Please provide both start and end dates.');
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        requestDate,
        startDate,
        endDate,
        leaveType,
        comment: comments
      };

      // call helper: will send multipart if file exists, JSON otherwise
      const result = await postVacationRequest(employee.code, payload, file);
      console.log('Vacation request result:', result);

      alert('Leave request submitted successfully.');
      resetForm();
      onSuccess();
    } catch (err) {
      console.error('Leave request failed:', err);
      // extract friendly message if possible
      let msg = 'Failed to submit leave request. Please try again.';
      try {
        const m = String(err.message || err);
        const possibleJson = m.trim().startsWith('{') ? JSON.parse(m) : null;
        if (possibleJson && possibleJson.message) msg = possibleJson.message;
        else if (m) msg = m;
      } catch {}
      alert(`Leave request failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Drag handlers (mouse + touch)
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const left = clientX - offset.x;
      const top = clientY - offset.y;

      // clamp to viewport so modal doesn't go fully off-screen
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = containerRef.current;
      const w = el ? el.offsetWidth : 600;
      const h = el ? el.offsetHeight : 420;
      const clampedLeft = Math.max(8, Math.min(left, vw - w - 8));
      const clampedTop = Math.max(8, Math.min(top, vh - h - 8));
      setPos({ left: clampedLeft, top: clampedTop });
    };

    const onUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, offset]);

  const startDrag = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // If we're using transform centering, switch to absolute positioning before dragging
    if (useTransformCenter) {
      setPos({ left: rect.left, top: rect.top });
      setUseTransformCenter(false);
    }

    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
    setIsDragging(true);
    // prevent text selection while dragging
    e.preventDefault();
  };

  // close handler that also resets scroll lock
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* container positioned either centered via transform or via absolute left/top */}
      <div
        ref={containerRef}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={
          useTransformCenter
            ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'absolute' }
            : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'absolute' }
        }
        className={`w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden cursor-auto`}
      >
        <div
          className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-500 text-white flex items-center justify-between select-none cursor-grab"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div>
            <h3 className="text-lg font-semibold">Request Details</h3>
            <p className="text-emerald-100 text-sm mt-1">Provide the dates and type for your leave.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleClose} aria-label="Close" className="p-2 rounded-md bg-white/10 hover:bg-white/20">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-2">
              <div className="text-sm text-slate-600 font-medium">Request date</div>
              <div className="relative">
                <input
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-10 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400">
                  <Calendar className="w-5 h-5" />
                </span>
              </div>
            </label>

            <label className="space-y-2">
              <div className="text-sm text-slate-600 font-medium">Leave start date</div>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-10 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400">
                  <Calendar className="w-5 h-5" />
                </span>
              </div>
            </label>

            <label className="space-y-2">
              <div className="text-sm text-slate-600 font-medium">Leave end date</div>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-10 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400">
                  <Calendar className="w-5 h-5" />
                </span>
              </div>
            </label>
          </div>

          <div>
            <div className="text-sm text-slate-600 font-medium mb-3">Leave Type</div>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-slate-700">
                <input
                  type="radio"
                  name="leaveType"
                  value="ANNUAL"
                  checked={leaveType === 'ANNUAL'}
                  onChange={() => setLeaveType('ANNUAL')}
                  className="form-radio text-emerald-600"
                />
                <span>Annual leave</span>
              </label>

              <label className="inline-flex items-center gap-2 text-slate-700">
                <input
                  type="radio"
                  name="leaveType"
                  value="SICK"
                  checked={leaveType === 'SICK'}
                  onChange={() => setLeaveType('SICK')}
                  className="form-radio text-emerald-600"
                />
                <span>Sick leave</span>
              </label>

              <div className="ml-auto flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition"
                >
                  <UploadCloud className="w-4 h-4" /> Upload File
                </button>
                <div className="text-sm text-slate-500">{file ? file.name : 'No file chosen'}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-600 font-medium mb-2">Comments</div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Write here..."
              className="w-full min-h-[140px] border border-slate-200 rounded-md p-4 text-slate-700 resize-vertical"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-md bg-gradient-to-r from-emerald-600 to-green-500 text-white font-medium hover:from-emerald-700 hover:to-green-600 transition shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Leave Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
