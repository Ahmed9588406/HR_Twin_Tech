import React, { useState, useEffect } from 'react';
import { X, UserCircle, Search, Users, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { addEmployeeToTeam, removeEmployeeFromTeam, fetchTeamById } from './api/work_teams_api';
import { fetchEmployees as fetchSettingsEmployees } from '../Settings/api/employees_api';
import { getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';
import translations from '../../i18n/translations';

export default function AddNewMembers({ team, onClose, onMembersChange }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [teamData, setTeamData] = useState(null);
  const [lang, setLang] = useState(_getLang());

  const t = (key, params = {}) => {
    const langData = translations[lang] || translations.en;
    let text = langData[key] || key;
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });
    return text;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeesRes, teamRes] = await Promise.allSettled([
          fetchSettingsEmployees(),
          fetchTeamById(team.id)
        ]);

        const rawEmployees = employeesRes.status === 'fulfilled' ? employeesRes.value : [];
        const empList = (Array.isArray(rawEmployees) ? rawEmployees : []).map(e => ({
          empCode: e.id ?? e.code ?? e.empCode,
          empName: e.name ?? e.empName,
          jobPosition: e.position ?? e.jobPosition,
          empPhoto: e.image ?? e.empPhoto ?? e.data,
          contentType: e.contentType ?? e.content_type,
          deptartment: e.department ?? e.dept
        }));

        const rawTeam = teamRes.status === 'fulfilled' ? teamRes.value : {};
        const memberList = (Array.isArray(rawTeam.teamMembers) ? rawTeam.teamMembers : []).map(m => ({
          empCode: m.id,
          empName: m.name,
          jobPosition: m.jobTitle,
          empPhoto: m.data,
          contentType: m.contentType,
          deptartment: m.department
        }));

        setEmployees(empList);
        setMembers(memberList);
        setTeamData(rawTeam);
      } catch (error) {
        console.error('Unexpected error loading data:', error);
        setEmployees([]);
        setMembers([]);
        setTeamData(null);
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [team.id]);

  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);

  const handleSelectEmployee = (employee) => {
    setSelectedEmployeeId(employee.empCode);
    setDropdownOpen(false);
    setSearchQuery('');
  };

  const handleAddMember = async () => {
    if (selectedEmployeeId) {
      setLoading(true);
      try {
        const result = await addEmployeeToTeam(team.id, selectedEmployeeId);
        if (result.success) {
          const updatedTeam = await fetchTeamById(team.id);
          const memberList = (Array.isArray(updatedTeam.teamMembers) ? updatedTeam.teamMembers : []).map(m => ({
            empCode: m.id,
            empName: m.name,
            jobPosition: m.jobTitle,
            empPhoto: m.data,
            contentType: m.contentType,
            deptartment: m.department
          }));
          setMembers(memberList);
          setTeamData(updatedTeam);
          setSelectedEmployeeId('');
          if (onMembersChange) onMembersChange();
        } else {
          alert(result.message);
          const updatedTeam = await fetchTeamById(team.id);
          const memberList = (Array.isArray(updatedTeam.teamMembers) ? updatedTeam.teamMembers : []).map(m => ({
            empCode: m.id,
            empName: m.name,
            jobPosition: m.jobTitle,
            empPhoto: m.data,
            contentType: m.contentType,
            deptartment: m.department
          }));
          setMembers(memberList);
          setTeamData(updatedTeam);
          if (onMembersChange) onMembersChange();
        }
      } catch (error) {
        console.error('Error adding member:', error);
        alert(t('FAILED_ADD_MEMBER', { error: error.message }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveMember = async (employeeId) => {
    if (window.confirm(t('CONFIRM_REMOVE_MEMBER'))) {
      try {
        await removeEmployeeFromTeam(team.id, employeeId);
        const updatedTeam = await fetchTeamById(team.id);
        const memberList = (Array.isArray(updatedTeam.teamMembers) ? updatedTeam.teamMembers : []).map(m => ({
          empCode: m.id,
          empName: m.name,
          jobPosition: m.jobTitle,
          empPhoto: m.data,
          contentType: m.contentType,
          deptartment: m.department
        }));
        setMembers(memberList);
        setTeamData(updatedTeam);
        if (onMembersChange) onMembersChange();
      } catch (error) {
        console.error('Error removing member:', error);
        alert(t('ERROR_REMOVING_MEMBER', { error: error.message }));
      }
    }
  };

  const selectedEmployee = employees.find(emp => String(emp.empCode) === String(selectedEmployeeId));
  const selectedEmployeeName = selectedEmployee?.empName || '';

  const availableEmployees = employees.filter(
    emp => !members.some(member => String(member.empCode) === String(emp.empCode))
  );

  const filteredEmployees = availableEmployees.filter(emp =>
    emp.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.jobPosition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEmployeeImage = (employee) => {
    if (employee.contentType && employee.empPhoto) {
      return `data:${employee.contentType};base64,${employee.empPhoto}`;
    }
    return null;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (initialLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-5xl p-8 relative overflow-y-auto max-h-[85vh]">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -z-0" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {team.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{t('TEAM_MANAGEMENT')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:rotate-90 transform"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Current Members Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{t('TEAM_MEMBERS')}</h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              {teamData?.numberOfEmployees ?? members.length}
            </span>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">{t('NO_CURRENT_MEMBERS')}</h3>
              <p className="text-gray-500 text-sm">{t('START_ADDING_MEMBERS')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('IMAGE')}</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{t('NAME')}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('DEPARTMENT')}</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{t('POSITION')}</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{t('ACTIONS')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.empCode ?? member.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <img
                          src={getEmployeeImage(member)}
                          alt={member.empName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 truncate">{member.empName}</td>
                      <td className="px-4 py-3 truncate">{member.deptartment || 'N/A'}</td>
                      <td className="px-4 py-3 truncate">{member.jobPosition || 'N/A'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemoveMember(member.empCode ?? member.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add New Member Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-semibold text-gray-800">{t('ADD_NEW_MEMBER')}</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-left flex items-center justify-between bg-white hover:border-emerald-300 transition-all group"
              >
                <span className={selectedEmployeeName ? "text-gray-900 font-medium" : "text-gray-400"}>
                  {selectedEmployeeName || t('CHOOSE_EMPLOYEE')}
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Search Bar */}
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('SEARCH_EMPLOYEES')}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Employee List */}
                  <div className="max-h-72 overflow-y-auto">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map(employee => {
                        const imgSrc = getEmployeeImage(employee);
                        return (
                          <div
                            key={employee.empCode}
                            onClick={() => handleSelectEmployee(employee)}
                            className="flex items-center px-4 py-3.5 hover:bg-emerald-50 cursor-pointer transition-all border-b border-gray-50 last:border-b-0 group"
                          >
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={employee.empName}
                                className="w-12 h-12 rounded-lg object-cover mr-3 ring-2 ring-gray-200 group-hover:ring-emerald-300 transition-all"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold mr-3 ring-2 ring-gray-200 group-hover:ring-emerald-300 transition-all">
                                {getInitials(employee.empName)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                                {employee.empName}
                              </div>
                              <div className="text-sm text-gray-500 truncate">{employee.jobPosition || t('NOT_SPECIFIED')}</div>
                            </div>
                            <Plus className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-12 text-center">
                        <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">{t('NO_EMPLOYEES_FOUND')}</p>
                        <p className="text-gray-400 text-sm mt-1">{t('TRY_DIFFERENT_SEARCH')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleAddMember}
              disabled={loading || !selectedEmployeeId}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2 justify-center min-w-[160px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('ADDING')}
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  {t('ADD_MEMBER')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}