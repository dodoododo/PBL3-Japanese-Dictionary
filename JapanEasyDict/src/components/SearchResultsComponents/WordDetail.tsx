import React, { useState } from 'react';
import { Volume2, Bookmark, BookmarkCheck } from 'lucide-react';
import ExampleSentence from './ExampleSentence';
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

interface SaveWordResponse {
  success: boolean;
  message: string;
}

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
  const [message, setMessage] = useState<string | null>(null);

  if (!mainJapanese.reading) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded shadow">
        Error: Missing Japanese word data.
      </div>
    );
  }

  const handleSaveWord = async (retry = true) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMessage('Please log in to save words.');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const response = await axios.post<SaveWordResponse>(
        `/api/saved-words/user/${userId}/word/${word.id}`,
        {}
      );

      if (response.data.success) {
        onSaveWord(word);
        setMessage('Word saved successfully');
      } else {
        setMessage(response.data.message || 'Word already saved');
      }
    } catch (error: any) {
      console.error('Error saving word:', error);
      if (error.response?.status === 500 && retry) {
        setMessage('Database error, retrying...');
        setTimeout(() => handleSaveWord(false), 1000);
      } else {
        setMessage(error.response?.data?.message || 'Failed to save word. Please try again later.');
      }
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-slate-800 text-white">
        <div className="flex items-center">
          <h2 className="word-detail-main-word text-3xl font-bold">
            {word.word}
          </h2>
          <button 
            onClick={() => handleSaveWord(true)}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
            title={isSaved ? "Saved to library" : "Save to library"}
          >
            {isSaved ? <BookmarkCheck className="text-blue-400" /> : <Bookmark />}
          </button>
        </div>
        {message && (
          <div className={`mt-2 p-2 rounded text-sm ${
            message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
      
      <div className="word-detail-details">
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
        
        <div className="mb-6 flex flex-wrap gap-2">
          {word.is_common && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Common Word
            </span>
          )}
        </div>
        
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
        
        <ExampleSentence word={word} />
      </div>
    </div>
  );
}

export default WordDetail;