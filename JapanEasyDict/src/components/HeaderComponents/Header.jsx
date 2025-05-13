import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ChevronDown, Globe, Search, Volume2, LogIn, LogOut, Shield } from 'lucide-react';
import { isAuthenticated, logout } from '../../auth';
import "./Header.css";
import LoginForm from '../LoginFormComponents/LoginForm';
import { navLinks } from '../data/navLinks';
import NavLinks from '../NavLinks';

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
  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
  }, [location.pathname]);

  const logInOnClick = () => {
    navigate('/login');
  }

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

  // Reset selectedLevel khi URL thay đổi, trừ khi đang ở trang kanji
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

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <a href="/" onClick={handleReset} className="logo">
            <BookOpen className="logo-icon" />
            <div>
              <h1 className="logo-text">
                <span>Japan</span>Easy
              </h1>
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
            {/* <div className={`dropdown ${languageDropdownOpen ? 'active' : ''}`} ref={languageDropdownRef}>
              <button
                className="dropdown-button language-button"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              >
                <Globe />
                {language === 'english' ? 'English' : 'Tiếng Việt'}
                <ChevronDown />
              </button>
              <div className={`dropdown-content ${languageDropdownOpen ? 'show' : ''}`}>
                <button
                  onClick={() => {
                    setLanguage('english');
                    setLanguageDropdownOpen(false);
                  }}
                  className="dropdown-item"
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage('vietnamese');
                    setLanguageDropdownOpen(false);
                  }}
                  className="dropdown-item"
                >
                  Tiếng Việt
                </button>
              </div>
            </div> */}
            <ul className="inline-flex space-x-4 my-5 lg:py-3 mr-10 max-w-xl justify-between ml-10 w-[210px]">
                {
                    navLinks.map((nav, idx) => {
                        return <NavLinks key={idx} nav={nav}/>
                    })
                }
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
                  <button
                    key={level}
                    onClick={() => handleLevelSelect(level)}
                    className="dropdown-item"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {isLoggedIn ? (
              <div className="user-dropdown">
                <button className="avatar-button" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                  <img src="/Pictures/aa28c0a8-7661-453e-b9f0-d1720455db9d.png" alt="avatar" className="user-avatar" />
                </button>
                {userDropdownOpen && (
                  <div className="user-menu">
                    <div className="user-info">
                      <img src="/Pictures/aa28c0a8-7661-453e-b9f0-d1720455db9d.png" alt="avatar" className="user-avatar-large" />
                      <div>
                        <div className="user-name">Ngọc Hau</div>
                        <div className="user-id">ID: 1852702</div>
                      </div>
                    </div>
                    <button className="edit-profile-button">
                      ✏️ Edit Profile
                    </button>
                    {isAdmin && (
                      <button 
                        className="admin-button"
                        onClick={handleAdminClick}
                      >
                        <Shield className="admin-icon" />Administration
                      </button>
                    )}
                    <button 
                      className="logout-button"
                      onClick={handleLogout}
                    >
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