import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronDown, Search, Volume2 } from 'lucide-react';
import { JLPT_DATA, EXAMPLE_SENTENCES } from './data';
import { isAuthenticated, isAdmin } from './auth';
import Header from './components/HeaderComponents/Header';
import LoginForm from './components/LoginFormComponents/LoginForm';
import Sidebar from './components/SideBarComponents/SideBar';
import FlashcardPage from './components/FlashCardComponents/FlashcardPage';
import JLPTPage from './components/JLPTComponents/JLPTPage';
import KanjiList from './components/JLPTComponents/KanjiList';
import AdminPage from './components/AdminComponents/Admin';
import SearchResultNew from './components/SearchResultsComponents/SearchResultNew';
import Footer from './components/FooterComponents/Footer.jsx';
import DnDGame from './components/views/DnDGame.jsx';
import EditProfile from './components/HeaderComponents/EditProfile.jsx';
import BookmarkPage from './components/BookmarkComponents/BookmarkPage.jsx';
import './auth.js';
import Kana from './components/KanaComponents/Kana.jsx';

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [popularWords, setPopularWords] = useState([]);
  const levelDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Reset search state when navigating to non-/search routes
  useEffect(() => {
    if (location.pathname !== '/search') {
      setSearchResult(null);
      setNoResults(false);
      setSearchTerm('');
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target)) {
        setLevelDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPopularWords = async () => {
      try {
        const wordViewsResponse = await fetch('http://localhost:8082/api/word-views/top');
        if (!wordViewsResponse.ok) {
          throw new Error('Failed to fetch top word views');
        }
        const wordViews = await wordViewsResponse.json();

        const wordIds = wordViews.map(view => view.wordId);
        const wordsResponse = await fetch('http://localhost:8082/api/words/by-ids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wordIds),
        });
        if (!wordsResponse.ok) {
          throw new Error('Failed to fetch word details');
        }
        const words = await wordsResponse.json();
        setPopularWords(words);
      } catch (err) {
        console.error('Failed to fetch popular words:', err);
      }
    };

    fetchPopularWords();
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
      const response = await fetch(`http://localhost:8082/api/words?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Not found in DB');
      }
      const data = await response.json();
      if (data) {
        setSearchResult(data);
        navigate('/search');
      } else {
        setNoResults(true);
      }
    } catch (error) {
      setNoResults(true);
      console.error('Handle search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setLevelDropdownOpen(false);
    navigate(`/kanji/${level.toLowerCase()}`);
  };

  const handleReset = () => {
    setSearchResult(null);
    setNoResults(false);
    setSearchTerm('');
    if (location.pathname === '/search') {
      navigate('/');
    }
  };

  const handleLoginSuccess = () => {
    setSearchResult(null);
    setNoResults(false);
    setSearchTerm('');
    setIsLoggedIn(true);
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setShowLoginForm(false);
    navigate('/');
  };

  return (
    <div className="app flex flex-col">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isLoading={isLoading}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        levelDropdownOpen={levelDropdownOpen}
        setLevelDropdownOpen={setLevelDropdownOpen}
        handleReset={handleReset}
        onLoginClick={() => setShowLoginForm(true)}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      <Sidebar
        onToggle={(isCollapsed) => {
          const mainContainer = document.querySelector('.main-container');
          if (mainContainer) {
            if (window.innerWidth <= 768) {
              mainContainer.classList.toggle('sidebar-visible', !isCollapsed);
            } else {
              mainContainer.classList.toggle('sidebar-collapsed', isCollapsed);
            }
          }
        }}
      />

      <div className="main-container">
        <main className="main">
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={
                  !selectedLevel && !searchResult && !isLoading && !noResults && (
                    <div className="welcome-page">
                      <div className="welcome">
                        <h1>Welcome to JapanEasy</h1>
                        <p>Your simple Japanese dictionary</p>
                      </div>
                      <section>
                        <h2>Popular Words</h2>
                        <div className="kanji-grid">
                          {popularWords.map((word, index) => (
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
                }
              />
              <Route
                path="/search"
                element={<SearchResultNew searchResult={searchResult} playPronunciation={playPronunciation} />}
              />
              <Route path="/jlpt" element={<JLPTPage />} />
              <Route path="/kanji/:level" element={<KanjiList />} />
              <Route path="/flashcards/:level" element={<FlashcardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/bookmark" element={<BookmarkPage />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/hiragana" element={<Kana title="Hiragana" symbol="あ" />} />
              <Route path="/katakana" element={<Kana title="Katakana" symbol="ア" />} />
              <Route path="/game" element={<DnDGame />} />
            </Routes>

            {isLoading ? (
              <div className="loader"></div>
            ) : noResults && location.pathname !== '/search' ? (
              <div className="no-results">
                <p>😕</p>
                <h2>No Results Found</h2>
                <p>Sorry, we couldn't find any definitions for that word.</p>
              </div>
            ) : searchResult && location.pathname !== '/search' ? (
              <SearchResultNew searchResult={searchResult} playPronunciation={playPronunciation} />
            ) : null}
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
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;