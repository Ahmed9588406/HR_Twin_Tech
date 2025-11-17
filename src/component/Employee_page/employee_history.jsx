import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function EmployeeAttendanceHistory({ historyData }) {
  if (!historyData || !historyData.content || historyData.content.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">No attendance history available.</div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ABSENT':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'text-green-700 bg-green-50';
      case 'ABSENT':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Attendance History
          </h3>
          <p className="text-sm text-slate-600 mt-1">Recent attendance records</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Check In</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Check Out</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Working Hours</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {historyData.content.map((record, index) => (
              <tr key={record.attendanceId || index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 text-slate-800 font-medium">
                  {new Date(record.day).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="py-4 px-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {record.checkIn || 'N/A'}
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    {record.checkOut || 'N/A'}
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600 font-medium">
                  {record.workingHours || 'N/A'}
                </td>
                <td className="py-4 px-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {getStatusIcon(record.status)}
                    {record.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {historyData.totalPages > 1 && (
        <div className="mt-4 text-center text-sm text-slate-500">
          Showing {historyData.numberOfElements} of {historyData.totalElements} records
        </div>
      )}
    </div>
  );
}
