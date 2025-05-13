import React, { useState, useEffect } from 'react';
import { 
  BarChart3, ScrollText, Book, Users, Settings, LogOut
} from 'lucide-react';
import { logout, isAuthenticated } from '../../auth';
import Dashboard from './Dashboard';
import KanjiManagement from './KanjiManagement';
import WordsManagement from './WordsManagement';
import './Admin.css';
import { Navigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Check authentication status on load
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

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
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen 2xl:w-screen p-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold">Japanese Admin Dashboard</h1>
            <p className="text-gray-400">Manage your Japanese learning content</p>
          </div>
          
          {(activeSection === 'kanji' || activeSection === 'words') && (
            <div className="mt-4 md:mt-0">
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="N5">JLPT N5</option>
                <option value="N4">JLPT N4</option>
                <option value="N3">JLPT N3</option>
                <option value="N2">JLPT N2</option>
                <option value="N1">JLPT N1</option>
              </select>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4 px-2">Navigation</h2>
              <div className="space-y-2">
                <button 
                  className={`w-full transition-colors p-3 rounded-lg text-left flex items-center space-x-3 ${
                    activeSection === 'dashboard' ? 'bg-blue-600' : 'bg-gray-900/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSection('dashboard')}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button 
                  className={`w-full transition-colors p-3 rounded-lg text-left flex items-center space-x-3 ${
                    activeSection === 'kanji' ? 'bg-blue-600' : 'bg-gray-900/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSection('kanji')}
                >
                  <ScrollText className="w-5 h-5" />
                  <span>Manage Kanji</span>
                </button>
                <button 
                  className={`w-full transition-colors p-3 rounded-lg text-left flex items-center space-x-3 ${
                    activeSection === 'words' ? 'bg-blue-600' : 'bg-gray-900/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSection('words')}
                >
                  <Book className="w-5 h-5" />
                  <span>Manage Words</span>
                </button>
                <button 
                  className={`w-full transition-colors p-3 rounded-lg text-left flex items-center space-x-3 ${
                    activeSection === 'users' ? 'bg-blue-600' : 'bg-gray-900/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSection('users')}
                >
                  <Users className="w-5 h-5" />
                  <span>User Data</span>
                </button>
                <button 
                  className={`w-full transition-colors p-3 rounded-lg text-left flex items-center space-x-3 ${
                    activeSection === 'settings' ? 'bg-blue-600' : 'bg-gray-900/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSection('settings')}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                
                {/* Divider */}
                <div className="border-t border-gray-700 my-4" />
                
                {/* Logout Button */}
                <button 
                  className="w-full transition-colors p-3 rounded-lg text-left flex items-center space-x-3 text-red-400 bg-gray-900/50 hover:bg-red-500/20"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Admin;