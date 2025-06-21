import React, { useState, useEffect } from 'react';
import { 
  BarChart3, ScrollText, Book, Users, Settings, LogOut
} from 'lucide-react';
import { isAuthenticated, isAdmin } from '../../auth';
import Dashboard from './Dashboard';
import KanjiManagement from './KanjiManagement';
import WordsManagement from './WordsManagement';
import UserManagement from './UserManagement';
import './Admin.css';
import { Navigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedLevel, setSelectedLevel] = useState('5');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Check authentication status on load
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  // Show toast notification
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // // Not logged in, show login form
  // if (!isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  // Render the appropriate content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'kanji':
        return <KanjiManagement level={selectedLevel} onShowToast={showToast} />;
      case 'words':
        return <WordsManagement level={selectedLevel} onShowToast={showToast} />;
      case 'users':
        return <UserManagement/>
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
  isAuthenticated() && isAdmin() ? (
    <div className="admin-container">
      <div className="admin-container-inner">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-header-title">Japanese Admin Dashboard</h1>
            <p className="admin-header-subtitle">Manage your Japanese learning content</p>
          </div>

          {(activeSection === 'kanji' || activeSection === 'words') && (
            <div className="admin-level-selector-container">
              <select
                className="admin-level-selector"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="5">JLPT N5</option>
                <option value="4">JLPT N4</option>
                <option value="3">JLPT N3</option>
                <option value="2">JLPT N2</option>
                <option value="1">JLPT N1</option>
              </select>
            </div>
          )}
        </header>

        <div className="admin-grid">
          {/* Sidebar */}
          <div className="admin-sidebar">
            <div>
              <h2 className="admin-sidebar-title">Navigation</h2>
              <div className="admin-nav-buttons">
                <button
                  className={`admin-nav-button ${activeSection === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveSection('dashboard')}
                >
                  <BarChart3 className="admin-nav-button-icon" />
                  <span>Dashboard</span>
                </button>
                <button
                  className={`admin-nav-button ${activeSection === 'kanji' ? 'active' : ''}`}
                  onClick={() => setActiveSection('kanji')}
                >
                  <ScrollText className="admin-nav-button-icon" />
                  <span>Manage Kanji</span>
                </button>
                <button
                  className={`admin-nav-button ${activeSection === 'words' ? 'active' : ''}`}
                  onClick={() => setActiveSection('words')}
                >
                  <Book className="admin-nav-button-icon" />
                  <span>Manage Words</span>
                </button>
                <button
                  className={`admin-nav-button ${activeSection === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveSection('users')}
                >
                  <Users className="admin-nav-button-icon" />
                  <span>User Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="admin-main-content">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="admin-toast admin-animate-fadeIn">
          {toast}
        </div>
      )}
    </div>
  ) : (
    <div>You dont have permission to enter this site</div>
  )
);

};

export default Admin;