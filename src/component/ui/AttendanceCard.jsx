import React from 'react';

const AttendanceCard = ({ count, label, color }) => (
  <div className={`${color} rounded-lg p-6 text-white shadow-lg`}>
    <div className="text-4xl font-bold mb-2">{count}</div>
    <div className="text-lg font-medium">{label}</div>
  </div>
);

export default function AttendanceCards({ data }) {
  const cards = [
    { count: data?.totalEmployees || 0, label: 'Employee', color: 'bg-blue-600' },
    { count: data?.totalAttendaceToday || 0, label: 'Attendance', color: 'bg-green-500' },
    { count: data?.totalAbsentToday || 0, label: 'Absent', color: 'bg-red-600' },
    { count: data?.totalFreeToday || 0, label: 'Day Off - Holiday', color: 'bg-yellow-500' }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <AttendanceCard
            key={index}
            count={card.count}
            label={card.label}
            color={card.color}
          />
        ))}
      </div>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Departments</h3>
        <ul className="space-y-2">
          {data?.deptNumOfEmp?.map((dept, index) => (
            <li key={index} className="flex justify-between">
              <span>{dept.name}</span>
              <span className="font-semibold">{dept.numberOfEmp} employees</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}