import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import TopNavBar from './components/layout/TopNavBar';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest"><span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {!isAuthPage && <TopNavBar />}
      <div className="flex flex-1 relative">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* Note: In Phase 3 we will update this to /workspace/:notebookId */}
          <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="/workspace/:notebookId" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
