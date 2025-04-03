import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ChevronDown, Globe, Search, Volume2, LogIn } from 'lucide-react';
import "./Header.css"

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
            <div className={`dropdown ${languageDropdownOpen ? 'active' : ''}`} ref={languageDropdownRef}>
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
            </div>

            <div className={`dropdown ${levelDropdownOpen ? 'active' : ''}`} ref={levelDropdownRef}>
              <button
                className="dropdown-button level-button"
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
              >
                {selectedLevel || translations.selectLevel}
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

            <button 
              className="login-button"
              onClick={onLoginClick}
            >
              <LogIn className="login-icon" />
              {language === 'english' ? 'Login' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 