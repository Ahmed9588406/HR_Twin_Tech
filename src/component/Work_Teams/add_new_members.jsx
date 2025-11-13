import React, { useState } from 'react';
import { X, UserCircle } from 'lucide-react';

export default function AddNewMembers({ team, onClose }) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [members, setMembers] = useState(team.members || []);

  const handleAddMember = () => {
    if (selectedEmployee.trim()) {
      setMembers(prev => [...prev, { name: selectedEmployee, department: 'Programming', position: 'Backend Developer' }]);
      setSelectedEmployee('');
    }
  };

  const handleRemoveMember = (index) => {
    setMembers(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{team.name} - Members</h1>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Members Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 text-sm border-b">
              <th className="py-3">Image</th>
              <th className="py-3">Name</th>
              <th className="py-3">Department</th>
              <th className="py-3">Position</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="py-3">
                  <UserCircle className="w-8 h-8 text-gray-400" />
                </td>
                <td className="py-3">{member.name}</td>
                <td className="py-3">{member.department}</td>
                <td className="py-3">{member.position}</td>
                <td className="py-3">
                  <button
                    onClick={() => handleRemoveMember(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No members added yet.</p>
        )}
      </div>

      {/* Add New Member */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-4">Add New Member</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select an employee</option>
            <option value="Abdulrahman Ahmed">Abdulrahman Ahmed</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
          </select>
          <button
            onClick={handleAddMember}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}
