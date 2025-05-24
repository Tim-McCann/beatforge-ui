// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PromptForm from './components/PromptForm';
import QueueStatus from './components/QueueStatus';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <PromptForm />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/queue"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <QueueStatus />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
