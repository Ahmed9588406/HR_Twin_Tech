import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, AlertCircle, Edit, Send, Trash2, Lock, Calendar, Clock, DollarSign, MessageSquare, CheckCircle } from 'lucide-react';

export default function VacationRequestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee } = location.state || {};
  const [status, setStatus] = useState('Pending');

  const handleAccept = () => setStatus('Accepted');
  const handleReject = () => setStatus('Rejected');
  const handleBack = () => navigate(-1);

  // If no employee data, show default or redirect
  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Employee Data</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Employee Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 h-32"></div>
              <div className="px-6 pb-6 -mt-16">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={employee.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"}
                      alt={employee.name}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                      employee.status === 'present' ? 'bg-green-500' : 
                      employee.status === 'absent' ? 'bg-red-500' : 'bg-yellow-500'
                    } animate-pulse`}></div>
                  </div>

                  {/* Employee Info */}
                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                    <p className="text-green-600 font-medium mt-1">{employee.role}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {employee.department}
                    </span>
                  </div>

                  {/* Present Badge */}
                  <div className="mt-6 w-full">
                    <div className={`border rounded-lg py-3 text-center ${
                      employee.status === 'present' 
                        ? 'bg-green-50 border-green-200' 
                        : employee.status === 'absent'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <CheckCircle className={`w-6 h-6 mx-auto mb-1 ${
                        employee.status === 'present' 
                          ? 'text-green-600' 
                          : employee.status === 'absent'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`} />
                      <span className={`font-semibold ${
                        employee.status === 'present' 
                          ? 'text-green-700' 
                          : employee.status === 'absent'
                          ? 'text-red-700'
                          : 'text-yellow-700'
                      }`}>
                        {employee.status === 'present' ? 'Present' : employee.status === 'absent' ? 'Absent' : 'On Leave'}
                      </span>
                    </div>
                  </div>

                  {/* Check-in Time */}
                  {employee.checkInTime && employee.status === 'present' && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500">Check-in Time</p>
                      <p className="text-lg font-semibold text-gray-900">{employee.checkInTime}</p>
                    </div>
                  )}

                  {/* Action Icons */}
                  <div className="mt-6 flex justify-center gap-4">
                    <button className="p-3 bg-green-50 hover:bg-green-100 rounded-full transition-colors">
                      <Phone className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-3 bg-green-50 hover:bg-green-100 rounded-full transition-colors">
                      <AlertCircle className="w-5 h-5 text-green-600" />
                    </button>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-6 flex justify-center gap-3 pt-6 border-t border-gray-200 w-full">
                    <button className="p-2.5 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-2.5 hover:bg-green-50 rounded-lg transition-colors">
                      <Send className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-2.5 hover:bg-green-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-2.5 hover:bg-green-50 rounded-lg transition-colors">
                      <Lock className="w-5 h-5 text-green-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Request Status</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  status === 'Accepted' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {status}
                </span>
              </div>
              
              {/* Action Buttons */}
              {status === 'Pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={handleReject}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>

            {/* Request Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Request Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Request Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Request Type</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium capitalize">Vacation</span>
                  </div>
                </div>

                {/* Request Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Request Date</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium">2025-06-03</span>
                  </div>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Start Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium">2025-06-03</span>
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">End Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <span className="text-gray-900 font-medium">2025-06-07</span>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="md:col-span-2">
                  <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-semibold">Duration: 5 Days</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comment
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">ffffffffffffffffffffffffffffffff</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Financial Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* OverTime Hours */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">OverTime Hours</label>
                  <div className="text-2xl font-bold text-gray-400">-</div>
                </div>

                {/* Advance Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Advance Amount</label>
                  <div className="text-2xl font-bold text-gray-400">-</div>
                </div>

                {/* OverTime Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">OverTime Amount</label>
                  <div className="text-2xl font-bold text-gray-400">-</div>
                </div>

                {/* Paid Status */}
                <div className="md:col-span-3 pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Paid From Company</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <span>2025 © TwinTech - SHL HR.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}