import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import AddNewTeam from './add_new_team';
import AddNewMembers from './add_new_members';
import { Eye, Edit2, X, Users, User, Calendar, Plus } from 'lucide-react';
import { fetchTeams, deleteTeam } from './api/work_teams_api'; // Import the delete API function
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function EmployeeManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Work Teams');
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

  const [departments, setDepartments] = useState([]); // Start with empty array
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false); // State for members modal visibility
  const [editingTeam, setEditingTeam] = useState(null); // State for the team being edited
  const [selectedTeam, setSelectedTeam] = useState(null); // State for the selected team in members modal
  const [attendanceStats, setAttendanceStats] = useState([]); // State for attendance statistics
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const tabs = [
    { id: 'Employees', label: _t('EMPLOYEES'), icon: User, path: '/employees' },
    { id: 'Work Teams', label: _t('WORK_TEAMS'), icon: Users, path: '/dashboard-teams' },
    { id: 'Employees Action', label: _t('EMPLOYEES_ACTION'), icon: Calendar, path: '/employees-action' },
  ];

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === '/employees') {
      setActiveTab('Employees');
    } else if (currentPath === '/dashboard-teams') {
      setActiveTab('Work Teams');
    } else if (currentPath === '/employees-action') {
      setActiveTab('Employees Action');
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    if (location.pathname !== tab.path) {
      navigate(tab.path);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(_t('CONFIRM_DELETE_TEAM'))) {
      try {
        setIsLoading(true);
        await deleteTeam(id);
        // Reload teams after deletion
        const loadTeams = async () => {
          try {
            const fetchedTeams = await fetchTeams();
            const mappedTeams = fetchedTeams.map(team => ({
              id: team.id,
              name: team.name,
              managers: team.managerName,
              employeeCount: team.numberOfEmployees || 0,
              members: team.members || []
            }));
            setDepartments(mappedTeams);
          } catch (error) {
            console.error('Error loading teams:', error);
          } finally {
            setIsLoading(false);
          }
        };
        await loadTeams();
      } catch (error) {
        alert(`${_t('FAILED_TO_DELETE_TEAM')}: ${error.message}`);
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team); // team already includes id
    setIsModalOpen(true);
  };

  const handleViewMembers = (team) => {
    setSelectedTeam(team); // Set the selected team for viewing members
    setIsMembersModalOpen(true);
  };

  const handleMembersChange = () => {
    // Reload teams when members change
    const loadTeams = async () => {
      try {
        setIsLoading(true);
        const fetchedTeams = await fetchTeams();
        const mappedTeams = fetchedTeams.map(team => ({
          id: team.id,
          name: team.name,
          managers: team.managerName,
          employeeCount: team.numberOfEmployees || 0,
          members: team.members || []
        }));
        setDepartments(mappedTeams);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeams();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleCloseMembersModal = () => {
    setIsMembersModalOpen(false);
    // Reload teams to update employee counts if needed
    const loadTeams = async () => {
      try {
        setIsLoading(true);
        const fetchedTeams = await fetchTeams();
        const mappedTeams = fetchedTeams.map(team => ({
          id: team.id,
          name: team.name,
          managers: team.managerName,
          employeeCount: team.numberOfEmployees || 0,
          members: team.members || []
        }));
        setDepartments(mappedTeams);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeams();
  };

  const handleAddOrUpdateTeam = (teamData) => {
    if (editingTeam) {
      // Update existing team in local state
      setDepartments(prev =>
        prev.map(dept =>
          dept.id === editingTeam.id
            ? { ...dept, name: teamData.teamName, managers: teamData.manager }
            : dept
        )
      );
    } else {
      // Add new team
      setDepartments(prev => [
        ...prev,
        { id: prev.length + 1, name: teamData.teamName, managers: teamData.manager, employeeCount: 0, members: [] }
      ]);
    }
    setIsModalOpen(false);
  };

  // show full list (no client-side search filter)
  const filteredDepartments = departments;

  const handleAdd = () => {
    setEditingTeam(null); // Clear editing team
    setIsModalOpen(true); // Open the modal for adding new team
  };

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setIsLoading(true);
        const fetchedTeams = await fetchTeams();
        // Assuming the API returns an array of teams with id, name, managerName, etc.
        const mappedTeams = fetchedTeams.map(team => ({
          id: team.id,
          name: team.name,
          managers: team.managerName,
          employeeCount: team.numberOfEmployees || 0, // Adjust based on API response
          members: team.members || []
        }));
        setDepartments(mappedTeams);
      } catch (error) {
        // alert('Failed to load teams');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, []);

  // Fetch attendance statistics
  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const response = await fetch('https://api.shl-hr.com/api/v1/attendance/statistics');
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          setAttendanceStats(data);
        } catch (parseError) {
          console.error('Parse error:', text.substring(0, 500));
        }
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      }
    };
    fetchAttendanceStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 p-6 lg:p-8 overflow-auto ${lang === 'ar' ? 'mr-20 xl:mr-72' : 'ml-20 xl:ml-72'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{_t('WORK_TEAMS_DASHBOARD')}</h1>
            <p className="text-gray-600">{_t('WORK_TEAMS_SUBTITLE')}</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
            <div className="flex items-center gap-1 p-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {activeTab === 'Work Teams' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex-1" />
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-green-50 border-b border-green-100">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4">
                      <div className="col-span-3 text-green-600 font-semibold">{_t('NAME')}</div>
                      <div className="col-span-3 text-green-600 font-semibold">{_t('MANAGERS')}</div>
                      <div className="col-span-5 text-green-600 font-semibold">{_t('NUM_OF_EMPLOYEES')}</div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={handleAdd} // Opens the modal to add a new team
                          className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center justify-center transition-colors"
                          aria-label={_t('ADD_NEW_TEAM')}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isLoading ? (
                    <div className="px-6 py-12 flex justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                  ) : (
                    <>
                      {/* Table Body */}
                      <div className="divide-y divide-gray-100">
                        {filteredDepartments.map((dept) => (
                          <div key={dept.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="col-span-3 text-gray-800">{dept.name}</div>
                            <div className="col-span-3 text-gray-600">{dept.managers}</div>
                            <div className="col-span-5 text-gray-600">{dept.employeeCount}</div>
                            <div className="col-span-1 flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewMembers(dept)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title={_t('VIEW_ALL')}
                              >
                                <Eye className="w-5 h-5 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleEdit(dept)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title={_t('EDIT')}
                              >
                                <Edit2 className="w-5 h-5 text-green-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(dept.id)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title={_t('DELETE')}
                              >
                                <X className="w-5 h-5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {filteredDepartments.length === 0 && (
                        <div className="px-6 py-12 text-center text-gray-500">
                          {_t('NO_DEPARTMENTS_FOUND')}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Employees Action' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{_t('EMPLOYEES_ACTION')}</h2>
                <p className="text-gray-600">{_t('EMPLOYEES_ACTION_SUBTITLE')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Team */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] p-4 animate-fadeIn">
          <div onClick={(e) => e.stopPropagation()}>
            <AddNewTeam
              onClose={handleCloseModal}
              onAddTeam={handleAddOrUpdateTeam}
              initialData={editingTeam}
            />
          </div>
        </div>
      )}

      {/* Modal for View/Add Members */}
      {isMembersModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] p-4 animate-fadeIn">
          <div onClick={(e) => e.stopPropagation()}>
            <AddNewMembers team={selectedTeam} onClose={handleCloseMembersModal} />
          </div>
        </div>
      )}
    </div>
  );
}