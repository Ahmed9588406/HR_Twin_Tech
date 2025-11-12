import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './ui/Sidebar'
import AttendanceCards from './ui/AttendanceCard.jsx'

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Using CORS proxy temporarily - ask backend team to fix CORS properly
        const response = await axios.get('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Dashboard data received:', response.data);
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {dashboardData && <AttendanceCards data={dashboardData} />}
      </div>
    </div>
  )
}

export default Dashboard