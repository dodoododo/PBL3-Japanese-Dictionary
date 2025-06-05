import React, { useState, useEffect } from 'react';

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

interface ExampleSentenceProps {
  word: WordData; // full word object
}

const ExampleSentence: React.FC<ExampleSentenceProps> = ({ word }) => {
  const [examples, setExamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExamples = async () => {
      if (!word?.id) {
        console.warn("No word ID found for example fetch.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8082/api/examples/${word.id}`);
        const contentType = response.headers.get("content-type");
        console.log("Response status:", response.status, "| Content-Type:", contentType);

        if (!response.ok) {
          console.error(`Failed to fetch examples (status ${response.status})`);
          return;
        }

        const data = await response.json();
        console.log("Raw fetched data:", data);

        if (Array.isArray(data)) {
          setExamples(data);
        } else if (Array.isArray(data.results)) {
          setExamples(data.results);
        } else {
          console.warn("Unexpected data shape for examples:", data);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
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
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!examples || examples.length === 0) {
    return (
      <div className="mt-6 text-slate-500 italic">
        No example sentences available.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-slate-800">Example Sentences</h3>
      <div className="space-y-4">
        {examples.map((example, index) => (
          <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-lg mb-1">{example.sentenceJp || '–'}</p>
            <p className="text-slate-600">{example.sentenceEn || '–'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleSentence;
