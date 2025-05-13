import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface ExampleSentenceProps {
  word: string;
}

const ExampleSentence: React.FC<ExampleSentenceProps> = ({ word }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [japanese, setJapanese] = useState<string>('');
  const [english, setEnglish] = useState<string>('');

  // Simulate API call to generate example sentence
  const generateExampleSentence = async () => {
    if (!word) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the OpenAI API
      // For demo purposes, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate response based on the word
      if (word === '会社' || word === 'かいしゃ') {
        setJapanese('私は大きな会社で働いています。');
        setEnglish('I work at a big company.');
      } else {
        setJapanese(`${word}についての例文です。`);
        setEnglish(`This is an example sentence about ${word}.`);
      }
    } catch (err) {
      setError('Failed to generate example sentence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (word) {
      generateExampleSentence();
    }
  }, [word]);

  return (
    <div className="border rounded-lg bg-slate-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Example Sentence</h3>
        <button
          onClick={generateExampleSentence}
          disabled={loading}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${
            loading
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Generating...' : 'Regenerate'}
        </button>
      </div>
      
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <div className="py-4 text-center text-slate-500">
          <p>Generating example...</p>
        </div>
      ) : (
        <div>
          <p className="mb-2 text-lg font-medium text-slate-800">{japanese}</p>
          <p className="text-slate-600">{english}</p>
        </div>
      )}
    </div>
  );
};

export default ExampleSentence;