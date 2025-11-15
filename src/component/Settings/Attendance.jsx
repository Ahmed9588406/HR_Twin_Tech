import React, { useState } from 'react';
import { Edit2, Check, Clock, Timer, TrendingUp, Activity, Save, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { fetchCompanySettings, updateCompanySettings } from './api/settings_api';

export default function Attendance() {
  const { attendanceProfiles } = useOutletContext();
  const [companySettings, setCompanySettings] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [companyError, setCompanyError] = useState(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({ delayTime: '', delayHour: '' });
  const [savingCompany, setSavingCompany] = useState(false);

  // Fetch company settings on mount
  React.useEffect(() => {
    let mounted = true;
    setLoadingCompany(true);
    setCompanyError(null);

    fetchCompanySettings()
      .then((data) => {
        if (!mounted) return;
        if (data) {
          setCompanySettings(data);
          setCompanyForm({
            delayTime: String(data.delayTime ?? ''),
            delayHour: String(data.delayHour ?? '')
          });
        } else {
          setCompanyError('No company data returned');
        }
      })
      .catch((err) => {
        console.error('Failed to load company settings', err);
        if (mounted) setCompanyError(String(err));
      })
      .finally(() => {
        if (mounted) setLoadingCompany(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveCompanySettings = async () => {
    setSavingCompany(true);
    setCompanyError(null);
    try {
      const payload = {
        delayTime: Number(companyForm.delayTime) || 0,
        delayHour: Number(companyForm.delayHour) || 0,
        discountPercent: (companySettings && companySettings.discountPercent) ? Number(companySettings.discountPercent) : 0,
        overTimePercent: (companySettings && companySettings.overTimePercent) ? Number(companySettings.overTimePercent) : 0
      };

      const updated = await updateCompanySettings(payload);
      if (updated) {
        setCompanySettings((prev) => ({
          ...(prev || {}),
          delayTime: payload.delayTime,
          delayHour: payload.delayHour,
          discountPercent: payload.discountPercent,
          overTimePercent: payload.overTimePercent,
          ...(updated.id ? { id: updated.id } : {})
        }));
      }
      setIsEditingCompany(false);
    } catch (err) {
      console.error('Failed to update company settings:', err);
      setCompanyError(String(err));
    } finally {
      setSavingCompany(false);
    }
  };

  const totalDelayMinutes = loadingCompany ? 0 : Number(companySettings?.delayTime ?? 0) + (Number(companySettings?.delayHour ?? 0) * 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
          <p className="text-gray-600">Monitor and configure company delay settings and attendance profiles</p>
        </div>

        {/* Company Delay Settings Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Company Delay Settings</h2>
                  <p className="text-green-50 text-sm">Configure delay time and hour parameters</p>
                </div>
              </div>
              {!isEditingCompany ? (
                <button
                  onClick={() => setIsEditingCompany(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-green-600 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditingCompany(false);
                    setCompanyForm({
                      delayTime: String(companySettings?.delayTime ?? ''),
                      delayHour: String(companySettings?.delayHour ?? '')
                    });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Delay Time Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-500 p-2 rounded-xl">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Delay Time</span>
                  </div>
                  {!isEditingCompany ? (
                    <div>
                      <div className="text-4xl font-bold text-green-700 mb-1">
                        {loadingCompany ? '—' : (companySettings?.delayTime ?? 0)}
                      </div>
                      <div className="text-sm text-gray-500">minutes</div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="number"
                        className="w-full px-4 py-3 text-2xl font-bold rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                        value={companyForm.delayTime}
                        onChange={(e) => setCompanyForm({ ...companyForm, delayTime: e.target.value })}
                        min="0"
                        placeholder="0"
                      />
                      <div className="text-sm text-gray-500 mt-2">minutes</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delay Hour Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-500 p-2 rounded-xl">
                      <Timer className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Delay Hours</span>
                  </div>
                  {!isEditingCompany ? (
                    <div>
                      <div className="text-4xl font-bold text-blue-700 mb-1">
                        {loadingCompany ? '—' : (companySettings?.delayHour ?? 0)}
                      </div>
                      <div className="text-sm text-gray-500">hours</div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="number"
                        className="w-full px-4 py-3 text-2xl font-bold rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        value={companyForm.delayHour}
                        onChange={(e) => setCompanyForm({ ...companyForm, delayHour: e.target.value })}
                        min="0"
                        step="0.1"
                        placeholder="0"
                      />
                      <div className="text-sm text-gray-500 mt-2">hours</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-500 p-2 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Total Delay</span>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-700 mb-1">
                      {totalDelayMinutes}
                    </div>
                    <div className="text-sm text-gray-500">minutes total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Actions */}
            {isEditingCompany && (
              <div className="mt-6 flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <button
                  onClick={handleSaveCompanySettings}
                  disabled={savingCompany}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingCompany ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditingCompany(false);
                    setCompanyForm({
                      delayTime: String(companySettings?.delayTime ?? ''),
                      delayHour: String(companySettings?.delayHour ?? '')
                    });
                  }}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                {companyError && <div className="text-sm text-red-600">{companyError}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Company Overview Cards (updated: show all fields) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Name & ID */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-700">
              <h3 className="text-white text-sm font-semibold">Company</h3>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500">Name</div>
              <div className="mt-2 text-lg font-bold text-gray-900">{loadingCompany ? '—' : (companySettings?.name ?? '—')}</div>
              <div className="mt-3 text-sm text-gray-500">ID: {loadingCompany ? '—' : (companySettings?.id ?? '—')}</div>
            </div>
          </div>

          {/* Branches metrics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500">
              <h3 className="text-white text-sm font-semibold">Branches</h3>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500">Current / Limit</div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-2xl font-bold text-green-700">{loadingCompany ? '—' : (companySettings?.currantBranchNum ?? 0)}</div>
                <div className="text-sm text-gray-500">/ {loadingCompany ? '—' : (companySettings?.branchNumLimit ?? '—')}</div>
              </div>
              <div className="mt-3 text-sm text-gray-500">Remaining: {loadingCompany ? '—' : Math.max(0, (companySettings?.branchNumLimit ?? 0) - (companySettings?.currantBranchNum ?? 0))}</div>
            </div>
          </div>

          {/* Employees metrics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500">
              <h3 className="text-white text-sm font-semibold">Employees</h3>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500">Current / Limit</div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-2xl font-bold text-blue-700">{loadingCompany ? '—' : (companySettings?.currantEmpNum ?? 0)}</div>
                <div className="text-sm text-gray-500">/ {loadingCompany ? '—' : (companySettings?.empNumLimit ?? '—')}</div>
              </div>
              <div className="mt-3 text-sm text-gray-500">Remaining: {loadingCompany ? '—' : Math.max(0, (companySettings?.empNumLimit ?? 0) - (companySettings?.currantEmpNum ?? 0))}</div>
            </div>
          </div>

          {/* Delay Time */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-green-400 to-emerald-400">
              <h3 className="text-white text-sm font-semibold">Delay Time</h3>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500">Minutes</div>
              <div className="mt-2 text-2xl font-bold text-green-700">{loadingCompany ? '—' : (companySettings?.delayTime ?? 0)}</div>
            </div>
          </div>

          {/* Delay Hour */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-400 to-cyan-400">
              <h3 className="text-white text-sm font-semibold">Delay Hour</h3>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500">Hours</div>
              <div className="mt-2 text-2xl font-bold text-blue-700">{loadingCompany ? '—' : (companySettings?.delayHour ?? 0)}</div>
            </div>
          </div>

          {/* Overtime Minutes */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-400">
              <h3 className="text-white text-sm font-semibold">Overtime Minutes</h3>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500">Minutes</div>
              <div className="mt-2 text-2xl font-bold text-purple-700">{loadingCompany ? '—' : (companySettings?.overTimeMins ?? 0)}</div>
            </div>
          </div>

          {/* Discount Percent */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-violet-500">
              <h3 className="text-white text-sm font-semibold">Discount %</h3>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500">Discount Percent</div>
              <div className="mt-2 text-2xl font-bold text-indigo-700">{loadingCompany ? '—' : `${companySettings?.discountPercent ?? 0}%`}</div>
            </div>
          </div>

          {/* Overtime Percent */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-pink-500 to-red-400">
              <h3 className="text-white text-sm font-semibold">Overtime %</h3>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500">Overtime Percent</div>
              <div className="mt-2 text-2xl font-bold text-pink-700">{loadingCompany ? '—' : `${companySettings?.overTimePercent ?? 0}%`}</div>
            </div>
          </div>
        </div>
        {/* End Company Overview Cards (updated) */}

        {/* End remaining content: Company settings kept; chart and cards removed */}
      </div>
    </div>
  );
}
