import React, { useState, useRef, useEffect } from 'react';
import { User, Building2, Percent, Palmtree, X } from 'lucide-react';
import ChangePositionForm from './change_position_form';
import ChangeDepartmentForm from './change_dep';
import RewardDiscountForm from './reward_discount_form';
import SendVacationForm from './send_vecation_form'; // added import
import { t as _t } from '../i18n/i18n';

const BULK_ACTIONS = {
  CHANGE_POSITION: {
    key: 'CHANGE_POSITION',
    icon: User,
    label: _t('BULK_CHANGE_POSITION'),
    color: 'from-emerald-500 to-teal-500'
  },
  CHANGE_DEPARTMENT: {
    key: 'CHANGE_DEPARTMENT',
    icon: Building2,
    label: _t('BULK_CHANGE_DEPARTMENT'),
    color: 'from-green-500 to-emerald-500'
  },
  ADD_REWARD_DISCOUNT: {
    key: 'ADD_REWARD_DISCOUNT',
    icon: Percent,
    label: _t('BULK_ADD_REWARD_DISCOUNT'),
    color: 'from-teal-500 to-cyan-500'
  },
  SEND_VACATION: {
    key: 'SEND_VACATION',
    icon: Palmtree,
    label: _t('BULK_SEND_VACATION'),
    color: 'from-emerald-600 to-green-500'
  }
};

export default function BulkActionsModal({ selectedActions = [], onClose = () => {}, onSuccess = () => {} }) {
  const actions = Object.values(BULK_ACTIONS);

  const [showPositionForm, setShowPositionForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showRewardDiscountForm, setShowRewardDiscountForm] = useState(false);
  const [showSendVacationForm, setShowSendVacationForm] = useState(false); // added state

  // drag state
  const containerRef = useRef(null);
  const [useTransformCenter, setUseTransformCenter] = useState(true);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // drag listeners
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const left = clientX - offset.x;
      const top = clientY - offset.y;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = containerRef.current;
      const w = el ? el.offsetWidth : 600;
      const h = el ? el.offsetHeight : 400;
      const clampedLeft = Math.max(8, Math.min(left, vw - w - 8));
      const clampedTop = Math.max(8, Math.min(top, vh - h - 8));
      setPos({ left: clampedLeft, top: clampedTop });
    };

    const onUp = () => { if (isDragging) setIsDragging(false); };

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
    if (useTransformCenter) {
      setPos({ left: rect.left, top: rect.top });
      setUseTransformCenter(false);
    }
    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
    setIsDragging(true);
    e.preventDefault();
  };

  const handleActionClick = (action) => {
    switch (action.key) {
      case 'CHANGE_POSITION':
        setShowPositionForm(true);
        break;
      case 'CHANGE_DEPARTMENT':
        setShowDepartmentForm(true);
        break;
      case 'ADD_REWARD_DISCOUNT':
        setShowRewardDiscountForm(true);
        break;
      case 'SEND_VACATION':
        setShowSendVacationForm(true);
        break;
      default:
        console.log(`Applying ${action.label} to ${selectedActions.length} selected employees`);
        onSuccess();
    }
  };

  const handlePositionFormClose = () => {
    setShowPositionForm(false);
  };

  const handlePositionFormSuccess = () => {
    setShowPositionForm(false);
    onSuccess();
  };

  const handleDepartmentFormClose = () => {
    setShowDepartmentForm(false);
  };

  const handleDepartmentFormSuccess = () => {
    setShowDepartmentForm(false);
    onSuccess();
  };

  const handleRewardDiscountFormClose = () => {
    setShowRewardDiscountForm(false);
  };

  const handleRewardDiscountFormSuccess = () => {
    setShowRewardDiscountForm(false);
    onSuccess();
  };

  const handleSendVacationFormClose = () => {
    setShowSendVacationForm(false);
  };

  const handleSendVacationFormSuccess = () => {
    setShowSendVacationForm(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div
        ref={containerRef}
        style={
          useTransformCenter
            ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'absolute' }
            : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'absolute' }
        }
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-100 hover:scale-[1.01]"
      >
        {/* Header with Gradient */}
        <div
          className="bg-gradient-to-r from-emerald-600 to-green-500 p-6 relative overflow-hidden cursor-grab select-none"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {_t('BULK_ACTIONS_TITLE')}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="w-full group relative overflow-hidden rounded-xl border-2 border-slate-200 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative flex items-center gap-4 p-5">
                  {/* Icon container */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Label */}
                  <span className="text-lg font-semibold text-slate-700 group-hover:text-white transition-colors duration-300">
                    {action.label}
                  </span>
                  
                  {/* Arrow indicator */}
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="pt-4 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              {_t('BULK_ACTIONS_FOOTER').replace('{{n}}', String(selectedActions.length))}
            </p>
          </div>
        </div>
      </div>

      {/* Position Change Form */}
      {showPositionForm && (
        <ChangePositionForm
          selectedActions={selectedActions}
          onClose={handlePositionFormClose}
          onSuccess={handlePositionFormSuccess}
        />
      )}

      {/* Department Change Form */}
      {showDepartmentForm && (
        <ChangeDepartmentForm
          selectedActions={selectedActions}
          onClose={handleDepartmentFormClose}
          onSuccess={handleDepartmentFormSuccess}
        />
      )}

      {/* Reward/Discount Form */}
      {showRewardDiscountForm && (
        <RewardDiscountForm
          selectedActions={selectedActions}
          onClose={handleRewardDiscountFormClose}
          onSuccess={handleRewardDiscountFormSuccess}
        />
      )}

      {/* Send Vacation Form */}
      {showSendVacationForm && (
        <SendVacationForm
          selectedActions={selectedActions}
          onClose={handleSendVacationFormClose}
          onSuccess={handleSendVacationFormSuccess}
        />
      )}
    </div>
  );
}