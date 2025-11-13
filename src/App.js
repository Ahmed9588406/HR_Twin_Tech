import './App.css';
import Dashboard from './component/Dashboard';
import LoginPage from './component/login';
import E_dashboard from './component/Employee/E_dashboard';
import Employee from './component/Employee/employee';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-dashboard" element={<E_dashboard />} />
        <Route path="/employees" element={<Employee />} />
      </Routes>
    </Router>
  );
}

export default App;
