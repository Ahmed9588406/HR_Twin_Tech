import React from 'react';
import { CalendarCheck, CreditCard } from 'lucide-react';

export default function EmployeeRequests({ onVacationRequest, onAdvanceRequest }) {
  return (
    <div className="mt-6">
      <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 rounded-2xl shadow-lg overflow-hidden border border-emerald-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-semibold">Requests</h3>
              <p className="text-emerald-100 text-sm mt-1">Submit a vacation or advance request</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 text-white">
                <CalendarCheck className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white px-5 py-4 border-t border-emerald-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onVacationRequest}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 transition transform hover:-translate-y-0.5"
              aria-label="Vacation request"
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="font-medium">Vacation Request</span>
            </button>

            <button
              onClick={onAdvanceRequest}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 transition transform hover:-translate-y-0.5"
              aria-label="Advance request"
            >
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">Advance Request</span>
            </button>
          </div>

          <p className="text-xs text-emerald-500 mt-3">Your requests will be sent to HR for approval. You can track status in the Requests section.</p>
        </div>
      </div>
    </div>
  );
}
