import React from 'react';
import { Calendar, Clock, DollarSign, MessageSquare } from 'lucide-react';
import { t as _t } from '../../i18n/i18n';

/**
 * RequestDetailsSection - Dynamically renders request details based on request type
 * Supports: Vacation Request, Advance Request, Over Time
 */
export default function RequestDetailsSection({ requestData, downloadFile }) {
    // Calculate duration for vacation requests
    const calculateDuration = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    };

    const duration = calculateDuration(requestData.startDate, requestData.endDate);
    // Make request type detection case-insensitive 
    const requestType = (requestData.requestType || '').toLowerCase();

    console.log('RequestDetailsSection Debug:', {
        fullRequestData: requestData,
        requestTypeRaw: requestData.requestType,
        requestTypeNormalized: requestType,
        advanceAmount: requestData.advanceAmount,
        amount: requestData.amount,
        isAdvance: requestType.includes('advance')
    });

    // Determine request type (case-insensitive)
    const isVacation = requestType.includes('vacation') || requestType.includes('leave');
    const isAdvance = requestType.includes('advance');
    const isOvertime = requestType.includes('overtime') || requestType.includes('over time');

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{_t('REQUEST_DETAILS')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Request Type - Always shown */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('REQUEST_TYPE')}</label>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span className="text-gray-900 font-medium capitalize">{requestData.requestType}</span>
                    </div>
                </div>

                {/* Request Date - Always shown */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('REQUEST_DATE')}</label>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="text-gray-900 font-medium">{requestData.requestDate}</span>
                    </div>
                </div>

                {/* VACATION REQUEST FIELDS */}
                {isVacation && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('START_DATE')}</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                <span className="text-gray-900 font-medium">{requestData.startDate || '-'}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('END_DATE')}</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-red-600" />
                                <span className="text-gray-900 font-medium">{requestData.endDate || '-'}</span>
                            </div>
                        </div>

                        {requestData.startDate && requestData.endDate && (
                            <div className="md:col-span-2">
                                <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700 font-semibold">{_t('DURATION')}: {duration} {_t('DAYS')}</span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ADVANCE REQUEST FIELDS */}
                {isAdvance && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('ADVANCE_AMOUNT')}</label>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <span className="text-gray-900 font-bold text-2xl">
                                    {requestData.amount || requestData.advanceAmount || '-'} {_t('CURRENCY')}
                                </span>
                            </div>
                        </div>

                        {requestData.reason && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('REASON')}</label>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-900 font-medium">{requestData.reason}</span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* OVERTIME REQUEST FIELDS */}
                {isOvertime && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('OVERTIME_DATE')}</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                <span className="text-gray-900 font-medium">{requestData.date || requestData.overtimeDate || '-'}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('OVERTIME_HOURS')}</label>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600" />
                                <span className="text-gray-900 font-bold text-2xl">
                                    {requestData.hours || requestData.overtimeHours || '-'} {_t('HOURS')}
                                </span>
                            </div>
                        </div>

                        {requestData.overtimeMins && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('OVERTIME_MINS')}</label>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <span className="text-gray-900 font-medium text-xl">{requestData.overtimeMins} {_t('MINUTES')}</span>
                                </div>
                            </div>
                        )}

                        {requestData.overtimeAmount && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('OVERTIME_AMOUNT')}</label>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-900 font-bold text-2xl">{requestData.overtimeAmount} {_t('CURRENCY')}</span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Comment - Show for all types if available */}
                {requestData.comment && (
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {_t('COMMENT')}
                        </label>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-gray-700">{requestData.comment}</p>
                        </div>
                    </div>
                )}

                {/* File Paths - Show for all types if available */}
                {requestData.filePaths && requestData.filePaths.length > 0 && (
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('ATTACHED_FILES')}</label>
                        <div className="space-y-2">
                            {requestData.filePaths.map((filePath, index) => (
                                <button
                                    key={index}
                                    onClick={() => downloadFile(filePath)}
                                    className="block bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg p-3 transition-colors font-medium text-left w-full"
                                >
                                    📎 {_t('DOWNLOAD_DOC')} {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
