import React, { useState } from 'react';
import WordList from './WordList';
import WordDetail from './WordDetail';
import './SearchResult.css';
import axios from 'axios';

type Sense = {
  english_definitions: string[];
  parts_of_speech: string[];
};

type JapaneseWord = {
  word?: string;
  reading: string;
};

type WordData = {
  id?: string;
  word: string;
  reading: string;
  partOfSpeech?: number;
  meaning?: string[];
  is_common: boolean;
  jlpt: string[];
  senses: Sense[];
  japanese: JapaneseWord[];
};

interface SearchResultsNewProps {
  searchResult: any[];
  playPronunciation: (text: string) => void;
  translations?: any;
}

function SearchResultsNew({ searchResult, playPronunciation }: SearchResultsNewProps) {
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWordSelect = async (word: WordData) => {
    setSelectedWord(word);
    try {
      // Tăng view cho từ
      await axios.post(`/api/word-views/${word.id}/increment`);
      
      // Tăng view tổng trong ngày
      await axios.post(`/api/daily-views/increment`);
    } catch (err) {
      console.error("Failed to update view count", err);
    }
  };

  const saveWord = (word: WordData) => {
    if (!savedWords.some(saved => saved.word === word.word && saved.reading === word.reading)) {
      setSavedWords([...savedWords, word]);
    }
  };

  return (
    <div className="search-result-container w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex-grow">
      <main className="container mx-auto p-4 flex flex-col md:flex-row gap-6 mt-4">
        <section className="md:w-2/5">
          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <WordList 
              searchResults={searchResult} 
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
              isSaved={savedWords.some(saved => saved.word === selectedWord.word && saved.reading === selectedWord.reading)}
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
}

export default SearchResultsNew;
