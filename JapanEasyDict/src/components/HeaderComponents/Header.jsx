import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, ChevronDown, Globe, Search, Volume2,
  LogIn, LogOut, Shield
} from 'lucide-react';
import { isAuthenticated, logout } from '../../auth';
import './Header.css';
import { navLinks } from '../data/navLinks';
import NavLinks from '../KanaComponents/NavLinks';

const API_URL = "http://localhost:8082/api/users";

const Header = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  isLoading,
  language,
  setLanguage,
  languageDropdownOpen,
  setLanguageDropdownOpen,
  selectedLevel,
  setSelectedLevel,
  levelDropdownOpen,
  setLevelDropdownOpen,
  handleReset,
  translations,
  onLoginClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const levelDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    userId: '',
    profilePic: '/Pictures/mr-anonymous.png'
  });

  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];

  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const response = await fetch(`${API_URL}/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user info');
        const data = await response.json();
        setUserData({
          username: data.username || 'Anonymous',
          userId: data.id || '',
          profilePic: data.profilePic || '/Pictures/mr-anonymous.png'
        });
      } catch (error) {
        console.error('Failed to load user data:', error.message);
      }
    };

    if (isAuthenticated()) {
      setIsLoggedIn(true);
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
      loadUserData();
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!location.pathname.includes('/kanji/')) {
      setSelectedLevel('');
    }
  }, [location.pathname, setSelectedLevel]);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setLevelDropdownOpen(false);
    navigate(`/kanji/${level.toLowerCase()}`);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  const handleAdminClick = () => {
    setUserDropdownOpen(false);
    navigate('/admin');
  };

  const handleEditProfileClick = () => {
    setUserDropdownOpen(false);
    navigate('/edit-profile');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <a href="/" onClick={handleReset} className="logo">
            <BookOpen className="logo-icon" />
            <div>
              <h1 className="logo-text"><span>Japan</span>Easy</h1>
              <p>日本語辞書</p>
            </div>
          </a>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder={translations.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="search-button" disabled={isLoading}>
              <Search />
            </button>
          </form>

          <div className="controls">
            <ul className="inline-flex space-x-4 my-5 lg:py-3 mr-10 max-w-xl justify-between ml-10 w-[210px]">
              {navLinks.map((nav, idx) => (
                <NavLinks key={idx} nav={nav} />
              ))}
            </ul>

            <div className={`dropdown ${levelDropdownOpen ? 'active' : ''}`} ref={levelDropdownRef}>
              <button
                className="dropdown-button level-button"
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
              >
                Kanji Level
                <ChevronDown />
              </button>
              <div className={`dropdown-content ${levelDropdownOpen ? 'show' : ''}`}>
                {levels.map((level) => (
                  <button key={level} onClick={() => handleLevelSelect(level)} className="dropdown-item">
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {isLoggedIn ? (
              <div className="user-dropdown">
                <button className="avatar-button" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                  <img
                    src={userData.profilePic || '/Pictures/mr-anonymous.png'}
                    alt="avatar"
                    className="user-avatar"
                  />
                </button>
                {userDropdownOpen && (
                  <div className="user-menu">
                    <div className="user-info">
                      <img
                        src={userData.profilePic || '/Pictures/mr-anonymous.png'}
                        alt="avatar"
                        className="user-avatar-large"
                      />
                      <div>
                        <div className="user-name">{userData.username || 'Anonymous'}</div>
                        <div className="user-id">ID: {userData.userId || 'N/A'}</div>
                      </div>
                    </div>
                    <button className="edit-profile-button" onClick={handleEditProfileClick}>
                      ✏️ Edit Profile
                    </button>
                    {isAdmin && (
                      <button className="admin-button" onClick={handleAdminClick}>
                        <Shield className="admin-icon" /> Administration
                      </button>
                    )}
                    <button className="logout-button" onClick={handleLogout}>
                      <LogOut className="logout-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-button" onClick={onLoginClick}>
                <LogIn className="login-icon" />
                {language === 'english' ? 'Login' : 'Đăng nhập'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
