import React from 'react';
import { Volume2, Bookmark, BookmarkCheck } from 'lucide-react';
import ExampleSentence from './ExampleSentence';
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

interface WordDetailProps {
  word: WordData;
  playPronunciation: (text: string) => void;
  onSaveWord: (word: WordData) => void;
  isSaved: boolean;
}

function WordDetail({ 
  word, 
  playPronunciation, 
  onSaveWord,
  isSaved
}: WordDetailProps) {
  const mainJapanese = word.japanese?.[0] || { word: word.word, reading: word.reading };
  if (!mainJapanese.reading) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded shadow">
        Error: Missing Japanese word data.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-slate-800 text-white">
        <div className="flex items-center">
          <h2 className="word-detail-main-word text-3xl font-bold">
            {word.word}
          </h2>
          <button 
            onClick={() => onSaveWord(word)}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
            title={isSaved ? "Saved to library" : "Save to library"}
          >
            {isSaved ? <BookmarkCheck className="text-blue-400" /> : <Bookmark />}
          </button>
        </div>
      </div>
      
      <div className="word-detail-details">
        {/* Reading */}
        <div className="mb-6 bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="word-detail-reading">
              <h3 className="text-lg text-slate-500 uppercase mb-1">Reading</h3>
              <p className="text-3xl text-slate-800 font-medium">{word.reading}</p>
            </div>
            <button 
              onClick={() => playPronunciation(mainJapanese.reading)}
              className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
              title="Play pronunciation"
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {word.is_common && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Common Word
            </span>
          )}
        </div>
        
        {/* Meanings */}
        <div className="mb-6 min-h-full">
          <h3 className="text-lg text-slate-500 uppercase">MEANING</h3>
          <div className="space-y-4">
            <p className="text-3xl text-slate-800 font-medium">
              {Array.isArray(word.meaning)
                ? word.meaning.slice(0, 2).join(', ')
                : word.meaning || 'No definition'}
              {Array.isArray(word.meaning) && word.meaning.length > 2 && '...'}
            </p>
          </div>
        </div>
        
        {/* Example Sentence */}
        <ExampleSentence word={word} />
      </div>
    </div>
  );
}

export default WordDetail;
