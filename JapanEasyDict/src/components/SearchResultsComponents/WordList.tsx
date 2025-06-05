import React from 'react';
import { Loader2 } from 'lucide-react';
import './SearchResult.css';


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

interface WordListProps {
  searchResults: WordData[];
  selectedWord: WordData | null;
  onWordSelect: (word: WordData) => void;
  loading?: boolean;
}

function WordList({ 
  searchResults, 
  selectedWord, 
  onWordSelect,
  loading
}: WordListProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-600">Searching...</span>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-slate-600 text-center">No results found</p>
      </div>
    );
  }

  return (
    <div className="word-list-overflow-container bg-white rounded-tr-lg rounded-br-lg shadow-md flex flex-col max-h-180">
      <div className="search-result-word-container px-4 py-2 bg-slate-800 text-white flex-shrink-0">
        <h2 className="text-lg">Search Results</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-slate-200">
          {searchResults.map((word) => {
            // const mainJapanese = word.japanese?.[0];
            const isSelected = selectedWord?.id === word.id;
            return (
              <li
                key={word.id || `${word.word}-${word.reading}`}
                className={`cursor-pointer transition-colors duration-200 ${
                  isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-50'
                }`}
                onClick={() => onWordSelect(word)}
              >
                <div className="search-result-indiviual-card min-h-23">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xl font-semibold mb-1">
                        {word.word},
                        <span className="text-orange-500 ml-2">{word.reading}</span>
                      </p>
                      <p className="text-slate-600">
                        {Array.isArray(word.meaning)
                          ? word.meaning.slice(0, 2).join(', ')
                          : word.meaning || 'No definition'}
                        {Array.isArray(word.meaning) && word.meaning.length > 2 && '...'}
                      </p>
                    </div>
                    <div>
                      {word.is_common && (
                        <span className="word-list-details bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Common
                        </span>
                      )}
                      {word.partOfSpeech && (
                        <span className="word-list-details bg-blue-100 text-blue-800 text-sm px-3 py-3 mr-2 rounded">
                          {word.partOfSpeech === 1 && 'Noun'}
                          {word.partOfSpeech === 2 && 'Verb'}
                          {word.partOfSpeech === 3 && 'Adjective'}
                        </span>
                      )}
                    </div>
                  </div>
                  {word.jlpt?.length > 0 && (
                    <div className="mt-2">
                      <span className="word-list-details bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        JLPT N{word.jlpt[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default WordList;
