import React, { useState, useEffect } from 'react';

interface ExampleSentenceProps {
  word: string;
}

const ExampleSentence: React.FC<ExampleSentenceProps> = ({ word }) => {
  const [examples, setExamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExamples = async () => {
      if (!word) return;
      
      setLoading(true);
      try {
        // This is a fallback API if you don't have example sentences in your local API
        const response = await fetch(`https://jisho.org/api/v1/search/example?query=${encodeURIComponent(word)}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.results) {
            setExamples(data.results.slice(0, 3)); // Get first 3 examples
          }
        }
      } catch (error) {
        console.error('Error fetching example sentences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamples();
  }, [word]);

  if (loading) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-slate-800">Example Sentences</h3>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (examples.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-slate-800">Example Sentences</h3>
      <div className="space-y-4">
        {examples.map((example, index) => (
          <div key={index} className="p-4 bg-slate-50 rounded-lg">
            <p className="text-lg mb-1">{example.japanese}</p>
            <p className="text-slate-600">{example.english}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleSentence;