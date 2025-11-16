import React, { useState } from 'react';
import { User, Building2, Calendar, Mail, Briefcase, Phone, MapPin, CreditCard } from 'lucide-react';

export default function ProgressTabsForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    employeeCode: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    department: '',
    position: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    startDate: '',
    salary: '',
    bankAccount: ''
  });

  const steps = [
    { icon: User, label: 'Personal Info' },
    { icon: Building2, label: 'Work Details' },
    { icon: Calendar, label: 'Employment' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-transparent backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line Background */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 -z-10" style={{ marginLeft: '48px', marginRight: '48px' }} />
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-12 left-0 h-1 bg-green-500 -z-10 transition-all duration-500"
              style={{ 
                width: `calc(${(currentStep / (steps.length - 1)) * 100}%)`,
                marginLeft: '5px',
                marginRight: '48px'
              }}
            />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-green-500 shadow-lg shadow-green-300 scale-110'
                        : isCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  >
                    <Icon
                      className={`w-10 h-10 ${
                        isActive || isCompleted ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`mt-3 text-sm font-medium ${
                      isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
          {/* Step 1: Personal Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Personal Information</h2>
              
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-3xl border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                  <span className="text-5xl text-gray-400">+</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Upload Photo</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Date Of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Number</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="Enter ID number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
                  <div className="flex gap-6 mt-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-green-500 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-green-500 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">Female</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Employee Code</label>
                  <input
                    type="text"
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleInputChange}
                    placeholder="Enter employee code"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Work Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Work Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter department"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Enter position"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Enter zip code"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Employment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Employment Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Bank Account Number</label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    placeholder="Enter bank account number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3">Review Your Information</h3>
                <p className="text-sm text-green-700">Please review all the information you've entered before submitting the form.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4 mt-10">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}