import './App.css';
import Dashboard from './component/Dashboard';
import LoginPage from './component/login';
import E_dashboard from './component/Employee/E_dashboard';
import Employee from './component/Employee/employee';
import DashboardTeams from './component/Work_Teams/dashboard_teams';
import AddNewTeam from './component/Work_Teams/add_new_team';
import ActionDashboard from './Employees_Action/action_dashboard';
import ReqDashboard from './component/Requests/req_dashboard';
import FinancialsDashboard from './component/Financials/financials_dashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-dashboard" element={<E_dashboard />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/dashboard-teams" element={<DashboardTeams />} />
        <Route path="/add-new-team" element={<AddNewTeam />} />
        <Route path="/employees-action" element={<ActionDashboard />} />
        <Route path="/requests" element={<ReqDashboard />} />
        <Route path="/financials" element={<FinancialsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
