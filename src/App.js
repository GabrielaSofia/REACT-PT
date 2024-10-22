// App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from './components/Login';
import AdminDashboard from './components/AdminPanel/AdminDashboard';
import SupervisorDashboard from './components/AdminPanel/SupervisorDashboard';
import EmployeeDashboard from './components/AdminPanel/EmployeeDashboard';
import Unauthorized from './components/Unauthorized';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
