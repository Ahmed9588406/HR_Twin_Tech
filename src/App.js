import './App.css';
import Dashboard from './component/Dashboard';
import LoginPage from './component/login';
import Employee from './component/Employee/employee';
import DashboardTeams from './component/Work_Teams/dashboard_teams';
import AddNewTeam from './component/Work_Teams/add_new_team';
import ActionDashboard from './Employees_Action/action_dashboard';
import ReqDashboard from './component/Requests/req_dashboard';
import FinancialsDashboard from './component/Financials/financials_dashboard';
import VacationRequestPage from './component/Employee_page/profile';
import EmployeeProfile from './component/Employee_page/Employee_profile';
import SettingsDashboard from './component/Settings/settingsDashboard';
import WorkPlace from './component/Settings/WorkPlace';
import Departments from './component/Settings/departments';
import Positions from './component/Settings/positions';
import WorkTiming from './component/Settings/WorkTiming';
import Attendance from './component/Settings/Attendance';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-dashboard" element={<Navigate to="/dashboard-teams" replace />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/dashboard-teams" element={<DashboardTeams />} />
        <Route path="/add-new-team" element={<AddNewTeam />} />
        <Route path="/employees-action" element={<ActionDashboard />} />
        <Route path="/requests" element={<ReqDashboard />} />
        <Route path="/financials" element={<FinancialsDashboard />} />
        <Route path="/employee-profile" element={<VacationRequestPage />} />
        <Route path="/employee-portal" element={<EmployeeProfile />} />
        <Route path="/settings" element={<SettingsDashboard />}>
          <Route path="workplace" element={<WorkPlace />} />
          <Route path="departments" element={<Departments />} />
          <Route path="positions" element={<Positions />} />
          <Route path="worktimings" element={<WorkTiming />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
