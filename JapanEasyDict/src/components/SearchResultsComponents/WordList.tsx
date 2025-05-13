import React from 'react';
import { WordData } from '../types';
import { Loader2 } from 'lucide-react';

interface WordListProps {
  searchResults: WordData[];
  selectedWord: WordData | null;
  onWordSelect: (word: WordData) => void;
  loading?: boolean;
}

const WordList: React.FC<WordListProps> = ({ 
  searchResults, 
  selectedWord, 
  onWordSelect,
  loading
}) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-slate-800 text-white">
        <h2 className="text-lg font-semibold">Search Results</h2>
      </div>
      <ul className="divide-y divide-slate-200">
        {searchResults.map((word) => {
          const mainJapanese = word.japanese[0];
          const isSelected = selectedWord?.id === word.id;
          
          return (
            <li 
              key={word.id} 
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-50'
              }`}
              onClick={() => onWordSelect(word)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-semibold mb-1">
                      {mainJapanese.word} 
                      <span className="text-orange-500 ml-2">{mainJapanese.reading}</span>
                    </p>
                    <p className="text-slate-600">
                      {word.senses[0].english_definitions.slice(0, 2).join(', ')}
                      {word.senses[0].english_definitions.length > 2 && '...'}
                    </p>
                  </div>
                  {word.is_common && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Common
                    </span>
                  )}
                </div>
                {word.jlpt && word.jlpt.length > 0 && (
                  <div className="mt-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      {word.jlpt[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WordList;