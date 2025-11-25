import './App.css';
import { useEffect, useState } from 'react';
import Dashboard from './component/Dashboard';
import LoginPage from './component/login';
import Employee from './component/Employee/employee';
import DashboardTeams from './component/Work_Teams/dashboard_teams';
import AddNewTeam from './component/Work_Teams/add_new_team';
import ActionDashboard from './Employees_Action/action_dashboard';
import ReqDashboard from './component/Requests/req_dashboard';
import FinancialsDashboard from './component/Financials/financials_dashboard';
import VacationRequestPage from './component/Requests/profile';
import EmployeeProfile from './component/Employee_page/Employee_profile';
import SettingsDashboard from './component/Settings/settingsDashboard';
import WorkPlace from './component/Settings/WorkPlace';
import Departments from './component/Settings/departments';
import Positions from './component/Settings/positions';
import WorkTiming from './component/Settings/WorkTiming';
import Attendance from './component/Settings/Attendance';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AuthRedirect from './components/AuthRedirect';
import UserDashboard from './Employees_roles/userdashboard'; // added user dashboard route

function App() {
  const [, forceUpdate] = useState({});
  
  // Apply language and direction globally
  useEffect(() => {
    let unsub;
    import('./i18n/i18n')
      .then((i18n) => {
        const apply = (lang) => {
          if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            forceUpdate({}); // Force re-render App
          }
        };
        apply(i18n.getLang());
        unsub = i18n.subscribe(apply);
      })
      .catch(() => {});
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);
  return (
    <Router>
      <AuthRedirect>
        <Routes>
          {/* Public route - Login page (only accessible when not authenticated) */}
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          
          {/* Protected routes - Require authentication */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/employee-dashboard" element={<ProtectedRoute><Navigate to="/dashboard-teams" replace /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
          <Route path="/dashboard-teams" element={<ProtectedRoute><DashboardTeams /></ProtectedRoute>} />
          <Route path="/add-new-team" element={<ProtectedRoute><AddNewTeam /></ProtectedRoute>} />
          <Route path="/employees-action" element={<ProtectedRoute><ActionDashboard /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><ReqDashboard /></ProtectedRoute>} />
          <Route path="/financials" element={<ProtectedRoute><FinancialsDashboard /></ProtectedRoute>} />
          <Route path="/employee-profile" element={<ProtectedRoute><VacationRequestPage /></ProtectedRoute>} />
          <Route path="/employee-portal" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsDashboard /></ProtectedRoute>}>
            <Route path="workplace" element={<WorkPlace />} />
            <Route path="departments" element={<Departments />} />
            <Route path="positions" element={<Positions />} />
            <Route path="worktimings" element={<WorkTiming />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>
        </Routes>
      </AuthRedirect>
    </Router>
  );
}

export default App;
