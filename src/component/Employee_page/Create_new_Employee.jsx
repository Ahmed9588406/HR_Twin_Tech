import React, { useState, useEffect } from 'react';
import { User, Building2, DollarSign, ArrowLeft, Upload, X } from 'lucide-react';
import { createEmployee, updateEmployee } from './api/emplyee_api';
import { fetchDepartments } from '../Settings/api/department_api';
import { fetchPositions } from '../Settings/api/positions_api';
import { fetchShifts } from '../Settings/api/settings_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function ProgressTabsForm({ employeeData, onSuccess, onClose }) {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

  const [currentStep, setCurrentStep] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [allPositions, setAllPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    department: '',
    position: '',
    startDate: '',
    shift: '',
    salary: '',
    username: '',
    password: '',
    file: null
  });

  const steps = [
    { icon: User, label: _t('PERSONAL_INFO') },
    { icon: Building2, label: _t('WORK_DETAILS') },
    { icon: DollarSign, label: _t('SALARY_ACCESS') }
  ];

  const isEditing = Boolean(employeeData && employeeData.id); // <-- added

  // Fetch departments, positions, and shifts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [departmentsData, positionsData, shiftsData] = await Promise.all([
          fetchDepartments(),
          fetchPositions(),
          fetchShifts()
        ]);
        
        console.log('Departments:', departmentsData);
        console.log('Positions:', positionsData);
        console.log('Shifts:', shiftsData);
        
        setDepartments(departmentsData || []);
        setAllPositions(positionsData || []);
        setShifts(shiftsData || []);
      } catch (err) {
        setError('Failed to load form data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter positions when department changes
  useEffect(() => {
    if (formData.department && allPositions.length > 0) {
      const selectedDept = departments.find(dept => dept.id === parseInt(formData.department));
      if (selectedDept) {
        // Filter positions by department name
        const filtered = allPositions.filter(pos => pos.department === selectedDept.name);
        setFilteredPositions(filtered);
        // Reset position when department changes
        setFormData(prev => ({ ...prev, position: '' }));
      }
    } else {
      setFilteredPositions([]);
    }
  }, [formData.department, departments, allPositions]);

  useEffect(() => {
    if (employeeData) {
      setFormData({
        ...employeeData,
        password: '', // Clear password for security
        file: null,   // Ensure file is null unless user uploads a new file
      });
      // Set image preview from the 'data' field (base64) or fallback to 'image' field
      const base64Image = employeeData.data || employeeData.image;
      if (employeeData.contentType && base64Image) {
        setImagePreview(`data:${employeeData.contentType};base64,${base64Image}`);
      }
    }
  }, [employeeData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validation: password is required only when creating a new employee
      const baseRequiredFields = [
        'name', 'number', 'dateOfBirth', 'gender', 'email',
        'department', 'position', 'startDate', 'shift', 'salary',
        'username'
      ];
      const requiredFields = isEditing ? baseRequiredFields : baseRequiredFields.concat('password');

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Log the formData for debugging
      console.log('Submitting employee data:', formData);

      // Submit the form
      if (employeeData && employeeData.id) {
        // Update existing employee
        await updateEmployee(formData);
        alert('Employee updated successfully!');
      } else {
        // Create new employee
        await createEmployee(formData);
        alert('Employee created successfully!');
      }
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to save employee');
      console.error('Error saving employee:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && departments.length === 0) {
    return (
      <div className="max-w-7xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{_t('LOADING_FORM')}</p>
        </div>
      </div>
    );
  }

  // If employeeData is provided, render as modal for editing
  if (employeeData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-7xl bg-transparent rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Form Content */}
          <div className="max-w-7xl w-full bg-transparent backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <div key={index} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-16 h-16 md:w-24 md:h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-green-500 shadow-lg shadow-green-300 scale-110'
                            : isCompleted
                            ? 'bg-green-500'
                            : 'bg-white border-2 border-gray-200'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 md:w-10 md:h-10 ${
                            isActive || isCompleted ? 'text-white' : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <span
                        className={`mt-2 md:mt-3 text-xs md:text-sm font-medium ${
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
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 overflow-y-auto max-h-[70vh]">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}

              {/* Step 1: Personal Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">{_t('PERSONAL_INFO')}</h2>
                  
                  <div className="flex flex-col items-center mb-8">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="w-32 h-32 rounded-3xl border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors overflow-hidden"
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-12 h-12 text-gray-400" />
                      )}
                    </label>
                    <p className="text-sm text-gray-500 mt-2">{_t('UPLOAD_PHOTO')}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('NAME')} *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={_t('ENTER_FULL_NAME')}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('DATE_OF_BIRTH')} *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('NUMBER')} *</label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        placeholder={_t('ENTER_ID')}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('GENDER')} *</label>
                      <div className="flex gap-6 mt-3">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleInputChange} className="w-5 h-5 text-green-500 focus:ring-green-500" />
                          <span className="ml-2 text-gray-700">{_t('MALE')}</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleInputChange} className="w-5 h-5 text-green-500 focus:ring-green-500" />
                          <span className="ml-2 text-gray-700">{_t('FEMALE')}</span>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('EMAIL')} *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={_t('ENTER_EMAIL')}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Work Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">{_t('WORK_DETAILS')}</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('DEPARTMENT')} *</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white text-gray-700 cursor-pointer"
                      >
                        <option value="">{_t('SELECT_DEPT')}</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name} - {_t('MANAGER')}: {dept.manager}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('POSITION')} *</label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.department}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white text-gray-700 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">{_t('SELECT_POS')}</option>
                        {filteredPositions.map((pos) => (
                          <option key={pos.id} value={pos.id}>
                            {pos.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('START_TIME')} *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{_t('TAB_SHIFTS')} *</label>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white text-gray-700 cursor-pointer"
                      >
                        <option value="">{_t('SELECT_SHIFT')}</option>
                        {shifts.map((shift) => (
                          <option key={shift.id} value={shift.id}>
                            {shift.name} ({shift.start} - {shift.end}) - {shift.branchName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Salary & Access */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">{_t('SALARY_ACCESS')}</h2>
                  
                  <div className="border border-gray-200 rounded-3xl p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{_t('SALARY')} *</label>
                        <input
                          type="number"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          placeholder="0.0"
                          required
                          className="w-full px-4 py-3 border-b border-gray-300 focus:border-green-500 outline-none transition-all text-gray-800 bg-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{_t('USERNAME')} *</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder={_t('USERNAME')}
                          required
                          className="w-full px-4 py-3 border-b border-gray-300 focus:border-green-500 outline-none transition-all text-gray-800 bg-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">{_t('PASSWORD')} *</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder={_t('PASSWORD')}
                          required={!isEditing}
                          className="w-full px-4 py-3 border-b border-gray-300 focus:border-green-500 outline-none transition-all text-gray-800 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3">{_t('REVIEW_INFO')}</h3>
                    <p className="text-sm text-green-700">{_t('REVIEW_MSG')}</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-10">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-green-600 font-medium hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    {_t('BACK')}
                  </button>
                )}
                {currentStep === 0 && <div></div>}
                
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {_t('NEXT')}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {employeeData && employeeData.id ? _t('UPDATING') : _t('CREATING')}
                      </>
                    ) : (
                      employeeData && employeeData.id ? _t('UPDATE') : _t('SUBMIT')
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default form rendering for creating new employee
  return (
    <div className="max-w-7xl w-full bg-transparent backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-16 h-16 md:w-24 md:h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-green-500 shadow-lg shadow-green-300 scale-110'
                      : isCompleted
                      ? 'bg-green-500'
                      : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 md:w-10 md:h-10 ${
                      isActive || isCompleted ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </div>
                <span
                  className={`mt-2 md:mt-3 text-xs md:text-sm font-medium ${
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
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 overflow-y-auto max-h-[70vh]">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Personal Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">{_t('PERSONAL_INFO')}</h2>
            
            <div className="flex flex-col items-center mb-8">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="w-32 h-32 rounded-3xl border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors overflow-hidden"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400" />
                )}
              </label>
              <p className="text-sm text-gray-500 mt-2">{_t('UPLOAD_PHOTO')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('NAME')} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={_t('ENTER_FULL_NAME')}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('DATE_OF_BIRTH')} *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('NUMBER')} *</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder={_t('ENTER_ID')}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('GENDER')} *</label>
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
                    <span className="ml-2 text-gray-700">{_t('MALE')}</span>
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
                    <span className="ml-2 text-gray-700">{_t('FEMALE')}</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('EMAIL')} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={_t('ENTER_EMAIL')}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Work Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">{_t('WORK_DETAILS')}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('DEPARTMENT')} *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white text-gray-700 cursor-pointer"
                >
                  <option value="">{_t('SELECT_DEPT')}</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} - {_t('MANAGER')}: {dept.manager}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('POSITION')} *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.department}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white text-gray-700 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">{_t('SELECT_POS')}</option>
                  {filteredPositions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('START_TIME')} *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">{_t('TAB_SHIFTS')} *</label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white text-gray-700 cursor-pointer"
                >
                  <option value="">{_t('SELECT_SHIFT')}</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name} ({shift.start} - {shift.end}) - {shift.branchName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Salary & Access */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">{_t('SALARY_ACCESS')}</h2>
            
            <div className="border border-gray-200 rounded-3xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{_t('SALARY')} *</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    required
                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-green-500 outline-none transition-all text-gray-800 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{_t('USERNAME')} *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={_t('USERNAME')}
                    required
                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-green-500 outline-none transition-all text-gray-800 bg-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">{_t('PASSWORD')} *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={_t('PASSWORD')}
                    required={!isEditing}
                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-green-500 outline-none transition-all text-gray-800 bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">{_t('REVIEW_INFO')}</h3>
              <p className="text-sm text-green-700">{_t('REVIEW_MSG')}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-green-600 font-medium hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              {_t('BACK')}
            </button>
          )}
          {currentStep === 0 && <div></div>}
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {_t('NEXT')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {employeeData && employeeData.id ? _t('UPDATING') : _t('CREATING')}
                </>
              ) : (
                employeeData && employeeData.id ? _t('UPDATE') : _t('SUBMIT')
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}