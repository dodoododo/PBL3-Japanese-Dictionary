import React, { useState, useEffect } from 'react';
import WordList from './WordList';
import WordDetail from './WordDetail';
import { WordData } from '../types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<WordData[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWordSelect = (word: WordData) => {
    setSelectedWord(word);
  };

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const saveWord = (word: WordData) => {
    if (!savedWords.some(saved => saved.id === word.id)) {
      setSavedWords([...savedWords, word]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-6 mt-4">
        <section className="md:w-2/5">
          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <WordList 
              searchResults={searchResults} 
              selectedWord={selectedWord} 
              onWordSelect={handleWordSelect}
              loading={loading}
            />
          )}
        </section>
        
        <section className="md:w-3/5">
          {selectedWord ? (
            <WordDetail 
              word={selectedWord}
              playPronunciation={playPronunciation}
              onSaveWord={saveWord}
              isSaved={savedWords.some(saved => saved.id === selectedWord.id)}
            />
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-slate-600">Search for a word and select it to see details</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;