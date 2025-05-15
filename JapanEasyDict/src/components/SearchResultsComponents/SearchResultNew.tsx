import React, { useState } from 'react';
import WordList from './WordList';
import WordDetail from './WordDetail';

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
  partOfSpeech?: string;
  meaning?: string;
  is_common: boolean;
  jlpt: string[];
  senses: Sense[];
  japanese: JapaneseWord[];
};

interface SearchResultsNewProps {
  searchResult: any[]; // incoming raw data
  playPronunciation: (text: string) => void;
  translations?: any;
}

// const sanitizeSearchResults = (results: any[]): WordData[] => {
//   return results.map((result) => ({
//     ...result,
//     senses: result.senses?.map((sense: any) => ({
//       ...sense,
//       parts_of_speech: sense.parts_of_speech ?? [],
//     })) ?? [],
//     jlpt: result.jlpt ?? [],
//     japanese: result.japanese ?? [], // <-- Ensure it's at least an empty array
//   }));
// };

function SearchResultsNew({ searchResult, playPronunciation }: SearchResultsNewProps) {
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWordSelect = (word: WordData) => {
    setSelectedWord(word);
  };

  const saveWord = (word: WordData) => {
    if (!savedWords.some(saved => saved.word === word.word && saved.reading === word.reading)) {
      setSavedWords([...savedWords, word]);
    }
  };

  // const sanitizedResults = sanitizeSearchResults(searchResult);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
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
