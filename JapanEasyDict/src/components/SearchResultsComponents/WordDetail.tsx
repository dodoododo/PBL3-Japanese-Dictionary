import React, { useState, useEffect } from 'react';
import { Volume2, Bookmark, BookmarkCheck, RefreshCw } from 'lucide-react';
import { WordData } from '../types';
import ExampleSentence from './ExampleSentence';

interface WordDetailProps {
  word: WordData;
  playPronunciation: (text: string) => void;
  onSaveWord: (word: WordData) => void;
  isSaved: boolean;
}

const WordDetail: React.FC<WordDetailProps> = ({ 
  word, 
  playPronunciation, 
  onSaveWord,
  isSaved
}) => {
  const mainJapanese = word.japanese[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-slate-800 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">
            {mainJapanese.word}
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
      
      <div className="p-6">
        {/* Reading */}
        <div className="mb-6 bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-slate-500 uppercase mb-1">Reading</h3>
              <p className="text-2xl text-slate-800 font-medium">{mainJapanese.reading}</p>
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
          {word.jlpt && word.jlpt.map((level, index) => (
            <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
              {level.toUpperCase()}
            </span>
          ))}
        </div>
        
        {/* Meanings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-800">Meanings</h3>
          <div className="space-y-4">
            {word.senses.map((sense, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                {sense.parts_of_speech && sense.parts_of_speech.length > 0 && (
                  <div className="mb-2">
                    {sense.parts_of_speech.map((pos, posIndex) => (
                      <span key={posIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                        {pos}
                      </span>
                    ))}
                  </div>
                )}
                <ul className="list-disc list-inside text-slate-700">
                  {sense.english_definitions.map((def, defIndex) => (
                    <li key={defIndex}>{def}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Example Sentence */}
        <ExampleSentence word={mainJapanese.word || mainJapanese.reading} />
      </div>
    </div>
  );
};

export default WordDetail;