import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronDown, Globe, Search, Volume2 } from 'lucide-react';

// Mock data for JLPT levels
const JLPT_DATA = {
  N5: [
    { kanji: '日', meaning: 'day, sun' },
    { kanji: '本', meaning: 'book, origin' },
    { kanji: '人', meaning: 'person' },
    { kanji: '月', meaning: 'moon, month' },
    { kanji: '火', meaning: 'fire' },
    { kanji: '水', meaning: 'water' },
    { kanji: '木', meaning: 'tree, wood' },
    { kanji: '金', meaning: 'gold, money' },
    { kanji: '土', meaning: 'earth, soil' },
    { kanji: '山', meaning: 'mountain' }
  ],
  N4: [
    { kanji: '同', meaning: 'same' },
    { kanji: '会', meaning: 'meeting' },
    { kanji: '多', meaning: 'many' },
    { kanji: '毎', meaning: 'every' },
    { kanji: '親', meaning: 'parent' },
    { kanji: '色', meaning: 'color' },
    { kanji: '走', meaning: 'run' },
    { kanji: '止', meaning: 'stop' },
    { kanji: '楽', meaning: 'comfort' },
    { kanji: '働', meaning: 'work' }
  ],
  N3: [
    { kanji: '政', meaning: 'politics' },
    { kanji: '経', meaning: 'economy' },
    { kanji: '際', meaning: 'occasion' },
    { kanji: '配', meaning: 'distribute' },
    { kanji: '席', meaning: 'seat' },
    { kanji: '残', meaning: 'remain' },
    { kanji: '能', meaning: 'ability' },
    { kanji: '術', meaning: 'technique' },
    { kanji: '格', meaning: 'status' },
    { kanji: '優', meaning: 'superior' }
  ],
  N2: [
    { kanji: '批', meaning: 'criticism' },
    { kanji: '判', meaning: 'judge' },
    { kanji: '認', meaning: 'recognize' },
    { kanji: '論', meaning: 'theory' },
    { kanji: '革', meaning: 'revolution' },
    { kanji: '障', meaning: 'obstacle' },
    { kanji: '域', meaning: 'region' },
    { kanji: '密', meaning: 'secret' },
    { kanji: '我', meaning: 'self' },
    { kanji: '故', meaning: 'reason' }
  ],
  N1: [
    { kanji: '憂', meaning: 'worry' },
    { kanji: '鬱', meaning: 'depression' },
    { kanji: '璧', meaning: 'perfection' },
    { kanji: '瞭', meaning: 'clear' },
    { kanji: '麗', meaning: 'lovely' },
    { kanji: '箋', meaning: 'letter' },
    { kanji: '籠', meaning: 'basket' },
    { kanji: '艦', meaning: 'warship' },
    { kanji: '闘', meaning: 'fight' },
    { kanji: '騰', meaning: 'rise' }
  ]
};

// Mock data for example sentences
const EXAMPLE_SENTENCES = {
  '日': [
    {
      japanese: '今日はいい日です。',
      english: 'Today is a good day.',
      romaji: 'Kyō wa ii hi desu.'
    },
    {
      japanese: '日本語を勉強しています。',
      english: 'I am studying Japanese.',
      romaji: 'Nihongo o benkyō shite imasu.'
    }
  ],
  '本': [
    {
      japanese: 'この本は面白いです。',
      english: 'This book is interesting.',
      romaji: 'Kono hon wa omoshiroi desu.'
    },
    {
      japanese: '本を読むのが好きです。',
      english: 'I like reading books.',
      romaji: 'Hon o yomu no ga suki desu.'
    }
  ]
};

// Mock data for popular words
const POPULAR_WORDS = [
  { word: '猫', reading: 'ねこ', meaning: 'cat' },
  { word: '犬', reading: 'いぬ', meaning: 'dog' },
  { word: '水', reading: 'みず', meaning: 'water' },
  { word: '火', reading: 'ひ', meaning: 'fire' },
  { word: '山', reading: 'やま', meaning: 'mountain' },
  { word: '川', reading: 'かわ', meaning: 'river' },
  { word: '空', reading: 'そら', meaning: 'sky' },
  { word: '雨', reading: 'あめ', meaning: 'rain' },
  { word: '雪', reading: 'ゆき', meaning: 'snow' },
  { word: '風', reading: 'かぜ', meaning: 'wind' },
  { word: '花', reading: 'はな', meaning: 'flower' },
  { word: '木', reading: 'き', meaning: 'tree' }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState('english');
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
      attributionText: 'The words and kanji on this web site come from the amazing dictionary files JMDict, EDICT and KANJIDIC. These files are the property of the Electronic Dictionary Research and Development Group, and are used in conformance with the Group\'s licence. The example sentences come from the projects Tatoeba and Tanaka Corpus. Kanji search by radicals is based on the Kradfile2 and Kradfile-u files containing radical decomposition of 13108 Japanese characters. Many thanks to all the people involved in those projects!'
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
      attributionText: 'Các từ và kanji trên trang web này đến từ các tệp từ điển tuyệt vời JMDict, EDICT và KANJIDIC. Các tệp này là tài sản của Nhóm Nghiên cứu và Phát triển Từ điển Điện tử, và được sử dụng phù hợp với giấy phép của Nhóm. Các câu ví dụ đến từ các dự án Tatoeba và Tanaka Corpus. Tìm kiếm Kanji theo bộ thủ dựa trên các tệp Kradfile2 và Kradfile-u chứa phân tích bộ thủ của 13108 ký tự tiếng Nhật. Xin cảm ơn tất cả những người tham gia vào các dự án đó!'
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
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(searchTerm)}`;
      
      const response = await fetch(proxyUrl + targetUrl, {
        headers: {
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        setSearchResult(data.data[0]);
      } else {
        setNoResults(true);
      }
    } catch {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/ja/${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error('Word not found');
        }
        const data = await response.json();
        const formattedResult = {
          slug: searchTerm,
          is_common: true,
          tags: [],
          jlpt: [],
          japanese: [{
            reading: data[0].word,
            type: 'reading',
            word: data[0].word
          }],
          senses: [{
            english_definitions: data[0].meanings.map(m => m.definitions[0].definition),
            parts_of_speech: data[0].meanings.map(m => m.partOfSpeech),
            tags: [],
            see_also: [],
            antonyms: [],
            source: [],
            info: []
          }]
        };
        setSearchResult(formattedResult);
      } catch (error) {
        setNoResults(true);
        console.error('Search error:', error);
      }
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-1/4">
              <a href="/" onClick={handleReset} className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-[var(--font-red)]" />
                <div>
                  <h1 className="text-2xl font-bold">
                    <span className="text-[var(--font-red)]">Japan</span>
                    <span className="text-gray-700 dark:text-gray-300">Easy</span>
                  </h1>
                  <p className="text-xs text-gray-500">日本語辞書</p>
                </div>
              </a>
            </div>

            <form onSubmit={handleSearch} className="w-full md:w-2/4 flex justify-center">
              <div className="relative w-full max-w-2xl">
                <input
                  type="text"
                  className="search-input w-full"
                  placeholder={translations.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  disabled={isLoading}
                >
                  <Search className={`w-5 h-5 text-[var(--input-icon)] ${isLoading ? 'opacity-50' : ''}`} />
                </button>
              </div>
            </form>

            <div className="w-full md:w-1/4 flex justify-center md:justify-end gap-2 md:gap-4">
              <div className="relative" ref={languageDropdownRef}>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                >
                  <Globe className="w-4 h-4" />
                  {language === 'english' ? 'English' : 'Tiếng Việt'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {languageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <button
                      onClick={() => handleLanguageSelect('english')}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageSelect('vietnamese')}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Tiếng Việt
                    </button>
                  </div>
                )}
              </div>

              <div className="relative" ref={levelDropdownRef}>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                >
                  {selectedLevel || translations.selectLevel}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {levelDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleLevelSelect(level)}
                        className="block w-full text-left px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!selectedLevel && !searchResult && !isLoading && !noResults && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{translations.welcome}</h2>
              <p className="text-xl text-gray-600 mb-6">{translations.welcomeDesc}</p>
              <div className="flex justify-center">
                <div className="relative w-full max-w-lg">
                  <input
                    type="text"
                    className="search-input w-full"
                    placeholder={translations.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Search className="w-5 h-5 text-[var(--input-icon)]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">{translations.popularWords}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {POPULAR_WORDS.map((word, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSearchTerm(word.word);
                      handleSearch(new Event('submit'));
                    }}
                  >
                    <span className="text-3xl mb-2 group-hover:text-red-600 transition-colors">
                      {word.word}
                    </span>
                    <span className="text-sm text-gray-600 text-center group-hover:text-red-600 transition-colors">
                      {word.reading} - {word.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{translations.attribution}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {translations.attributionText}
              </p>
            </div>
          </div>
        )}

        {selectedLevel && !searchResult && !isLoading && !noResults && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              JLPT {selectedLevel} {translations.kanjiList}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {JLPT_DATA[selectedLevel].map((kanji, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors group cursor-pointer"
                  onClick={() => {
                    setSearchTerm(kanji.kanji);
                    handleSearch(new Event('submit'));
                  }}
                >
                  <span className="text-4xl mb-2 group-hover:text-red-600 transition-colors">
                    {kanji.kanji}
                  </span>
                  <span className="text-sm text-gray-600 text-center group-hover:text-red-600 transition-colors">
                    {kanji.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">{translations.searching}</p>
          </div>
        ) : noResults ? (
          <div className="text-center py-8">
            <p className="text-xl mb-2">😕</p>
            <h2 className="text-lg font-semibold mb-2">{translations.noResults}</h2>
            <p className="text-gray-600">{translations.noResultsDesc}</p>
          </div>
        ) : searchResult && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-bold mb-2">
                        {searchResult.japanese[0].word || searchResult.japanese[0].reading}
                      </h2>
                      <button
                        onClick={() =>
                          playPronunciation(
                            searchResult.japanese[0].word || searchResult.japanese[0].reading
                          )
                        }
                        className="play-button"
                        aria-label="Play pronunciation"
                      >
                        <Volume2 />
                      </button>
                    </div>
                    <div className="text-xl text-gray-600">
                      {searchResult.japanese.map((item, index) => (
                        <span key={index} className="mr-4">
                          {item.reading}
                        </span>
                      ))}
                    </div>
                  </div>
                  {searchResult.is_common && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded">
                      {translations.commonWord}
                    </span>
                  )}
                </div>
                {searchResult.jlpt.length > 0 && (
                  <p className="text-[var(--font-red)] mb-2">
                    {translations.jlptLevel} {searchResult.jlpt[0].toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {searchResult.senses.map((sense, index) => (
              <div key={index} className="mb-8 bg-white rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                  <h4 className="text-gray-500 mb-4">{translations.meaning}</h4>
                  <ul className="meaning-list space-y-2 ml-6">
                    {sense.english_definitions.map((def, i) => (
                      <li key={i} className="text-[var(--font)]">
                        {def}
                      </li>
                    ))}
                  </ul>
                  {sense.parts_of_speech.length > 0 && (
                    <p className="text-gray-500 mt-2">{sense.parts_of_speech.join(', ')}</p>
                  )}
                </div>

                {searchResult.japanese[0].word && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-gray-500 mb-4">{translations.examples}</h4>
                    {getExampleSentences(searchResult.japanese[0].word).length > 0 ? (
                      <div className="space-y-4">
                        {getExampleSentences(searchResult.japanese[0].word).map((example, i) => (
                          <div key={i} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-lg mb-1">{example.japanese}</p>
                            <p className="text-gray-600 mb-1">{example.romaji}</p>
                            <p className="text-gray-500 text-sm">{example.english}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No example sentences available.</p>
                    )}
                  </div>
                )}

                {sense.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-4">
                    {sense.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-100 py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
          <p className="mb-2">
            © 2025 JapanEasy - {language === 'english' ? 'Japanese Dictionary' : 'Từ điển tiếng Nhật'}
          </p>
          <p className="text-xs">{translations.attributionText.substring(0, 150)}...</p>
        </div>
      </footer>
    </div>
  );
}

export default App;