import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronDown, Globe, Search, Volume2 } from 'lucide-react';
import { JLPT_DATA, EXAMPLE_SENTENCES, POPULAR_WORDS } from './data';
import { isAuthenticated, isAdmin,  login, logout} from './auth';
import Header from './components/HeaderComponents/Header';
import LoginForm from './components/LoginFormComponents/LoginForm';
import Sidebar from './components/SideBarComponents/SideBar';
import FlashcardPage from './components/FlashCardComponents/FlashcardPage';
import JLPTPage from './components/JLPTComponents/JLPTPage';
import KanjiList from './components/JLPTComponents/KanjiList';
import AdminPage from './components/AdminComponents/Admin';
import SearchResultNew from "./components/SearchResultsComponents/SearchResultNew";
import Footer from './components/FooterComponents/Footer.jsx';
import DnDGame from './components/views/DnDGame.jsx';
import * as wanakana from 'wanakana';
import EditProfile from './components/HeaderComponents/EditProfile.jsx';
import './auth.js'
import Kana from './components/KanaComponents/Kana.jsx';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState('english');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const levelDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];

  const translations = {
    english: {
      searchPlaceholder: 'Search for a word...',
      selectLevel: 'Select Level',
      noResults: 'No Results Found',
      noResultsDesc: "Sorry, we couldn't find any definitions for that word.",
      searching: 'Searching...',
      meaning: 'Meaning',
      pronunciation: 'Pronunciation',
      examples: 'Examples',
      commonWord: 'Common word',
      jlptLevel: 'JLPT Level:',
      kanjiList: 'Kanji List',
      welcome: 'Welcome to JapanEasy',
      welcomeDesc: 'Your simple Japanese dictionary',
      popularWords: 'Popular Words',
      attribution: 'Attribution',
      attributionText: 'The words and kanji on this web site come from the amazing dictionary files JMDict, EDICT and KANJIDIC. These files are the property of the Electronic Dictionary Research and Development Group, and are used in conformance with the Group\'s licence.'
    },
    vietnamese: {
      searchPlaceholder: 'Tìm kiếm từ...',
      selectLevel: 'Chọn cấp độ',
      noResults: 'Không tìm thấy kết quả',
      noResultsDesc: 'Xin lỗi, chúng tôi không thể tìm thấy định nghĩa cho từ đó.',
      searching: 'Đang tìm kiếm...',
      meaning: 'Ý nghĩa',
      pronunciation: 'Phát âm',
      examples: 'Ví dụ',
      commonWord: 'Từ thông dụng',
      jlptLevel: 'Cấp độ JLPT:',
      kanjiList: 'Danh sách Kanji',
      welcome: 'Chào mừng đến với JapanEasy',
      welcomeDesc: 'Từ điển tiếng Nhật đơn giản của bạn',
      popularWords: 'Từ phổ biến',
      attribution: 'Nguồn gốc',
      attributionText: 'Các từ và kanji trên trang web này đến từ các tệp từ điển tuyệt vời JMDict, EDICT và KANJIDIC. Các tệp này là tài sản của Nhóm Nghiên cứu và Phát triển Từ điển Điện tử.'
    }
  }[language];

  useEffect(() => {
    function handleClickOutside(event) {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target)) {
        setLevelDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'english' || savedLanguage === 'vietnamese') {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
    checkAuth();
  }, []);

  const playPronunciation = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
  
    setIsLoading(true);
    setNoResults(false);
    setSearchResult(null);
  
    try {
      // 1. Gọi backend
      const response = await fetch(`http://localhost:8082/api/words/?q=${searchTerm}`);
  
      if (!response.ok) {
        throw new Error('Không tìm thấy trong DB');
      }
  
      const data = await response.json();
      if (data) {
        setSearchResult(data);
      } else {
        setNoResults(true);
      }
    } catch (error) {
        setNoResults(true);
        console.error('Handle Search error: ', error);
      } finally {
      setIsLoading(false);
    }
  };
  
  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setLevelDropdownOpen(false);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setLanguageDropdownOpen(false);
  };

  const getExampleSentences = (kanji) => {
    return EXAMPLE_SENTENCES[kanji] || [];
  };

  const handleReset = () => {
    setSearchResult(null);
    setNoResults(false);
    setSearchTerm('');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setShowLoginForm(false);
  };

  return (
    <Router>
      <div className="app flex flex-col">
        <Header 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          isLoading={isLoading}
          language={language}
          setLanguage={setLanguage}
          languageDropdownOpen={languageDropdownOpen}
          setLanguageDropdownOpen={setLanguageDropdownOpen}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          levelDropdownOpen={levelDropdownOpen}
          setLevelDropdownOpen={setLevelDropdownOpen}
          handleReset={handleReset}
          translations={translations}
          onLoginClick={() => setShowLoginForm(true)}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
        />

        <Sidebar onToggle={(isCollapsed) => {
          const mainContainer = document.querySelector('.main-container');
          if (mainContainer) {
            if (window.innerWidth <= 768) {
              mainContainer.classList.toggle('sidebar-visible', !isCollapsed);
            } else {
              mainContainer.classList.toggle('sidebar-collapsed', isCollapsed);
            }
          }
        }} />
        
        <div className="main-container">
          <main className="main">   
            <div className="container">
              <Routes>
                <Route path="/" element={
                  !selectedLevel && !searchResult && !isLoading && !noResults && (
                    <div className = "welcome-page">
                      <div className="welcome">
                        <h1>{translations.welcome}</h1>
                        <p>{translations.welcomeDesc}</p>
                      </div>
                      <section>
                        <h2>{translations.popularWords}</h2>
                        <div className="kanji-grid">
                          {POPULAR_WORDS.map((word, index) => (
                            <div
                              key={index}
                              className="kanji-card"
                              onClick={() => {
                                setSearchTerm(word.word);
                                handleSearch(new Event('submit'));
                              }}
                            >
                              <div className="kanji-character">{word.word}</div>
                              <div>{word.reading} - {word.meaning}</div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  )
                } />
                
                <Route path="/jlpt" element={<JLPTPage />} />
                <Route path="/kanji/:level" element={<KanjiList />} />
                <Route path="/flashcards/:level" element={<FlashcardPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/hiragana" element={<Kana title="Hiragana" symbol="あ" />} />
                <Route path="/katakana" element={<Kana title="Katakana" symbol="ア" />} />
                <Route path="/game" element={<DnDGame />} />
              </Routes>

              {isLoading ? (
                <div className="loader"></div>
              ) : noResults ? (
                <div className="no-results">
                  <p>😕</p>
                  <h2>{translations.noResults}</h2>
                  <p>{translations.noResultsDesc}</p>
                </div>
              ) : searchResult && (
                <SearchResultNew
                  searchResult={searchResult} 
                  playPronunciation={playPronunciation} 
                  translations={translations} 
                />
              )} 
              
              
            </div>
          </main>
        </div>

        <Footer />
        
        {showLoginForm && (
          <LoginForm 
            onLoginSuccess={handleLoginSuccess} 
            onClose={() => setShowLoginForm(false)} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;