import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import TopNavBar from './components/layout/TopNavBar';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <TopNavBar />
      <div className="flex flex-1 relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace" element={<Workspace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
