import React, { useRef } from 'react';
import { BookOpen, ChevronDown, Globe, Search, Volume2, LogIn } from 'lucide-react';

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
  const levelDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];

  return (
    <header className="header">
      <div className="container">
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
            <div className="dropdown" ref={languageDropdownRef}>
              <button
                className="dropdown-button language-button"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              >
                <Globe />
                {language === 'english' ? 'English' : 'Tiếng Việt'}
                <ChevronDown />
              </button>
              {languageDropdownOpen && (
                <div className="dropdown-content">
                  <button
                    onClick={() => setLanguage('english')}
                    className="dropdown-item"
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('vietnamese')}
                    className="dropdown-item"
                  >
                    Tiếng Việt
                  </button>
                </div>
              )}
            </div>

            <div className="dropdown" ref={levelDropdownRef}>
              <button
                className="dropdown-button level-button"
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
              >
                {selectedLevel || translations.selectLevel}
                <ChevronDown />
              </button>
              {levelDropdownOpen && (
                <div className="dropdown-content">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className="dropdown-item"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
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