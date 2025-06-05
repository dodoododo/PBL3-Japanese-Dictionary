import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import './SearchResult.css';



const SearchResult = ({ searchResult, playPronunciation, translations }) => {
  if (!searchResult) return null;

  const mainWord =
    searchResult.word ||
    (searchResult.japanese && searchResult.japanese[0] && searchResult.japanese[0].word) ||
    '';
  const reading =
    searchResult.reading ||
    (searchResult.japanese && searchResult.japanese[0] && searchResult.japanese[0].reading) ||
    '';
  const isCommon = searchResult.is_common || false;
  const jlptLevel =
    searchResult.jlpt && searchResult.jlpt.length > 0
      ? searchResult.jlpt[0].replace('jlpt-', '').toUpperCase()
      : null;
  const partOfSpeech =
    typeof searchResult.partOfSpeech === 'string'
      ? searchResult.partOfSpeech
      : searchResult.partOfSpeech?.name ||
        (searchResult.senses && searchResult.senses[0]?.parts_of_speech?.join(', '));
  const meanings = searchResult.senses
    ? searchResult.senses.map((sense) => sense.english_definitions?.join(', '))
    : [searchResult.meaning];

  // State lưu câu ví dụ (một chuỗi duy nhất)
  const [exampleSentence, setExampleSentence] = useState('');
  const [loadingExample, setLoadingExample] = useState(false);
  const [errorExample, setErrorExample] = useState(null);

  const fetchExampleSentence = async () => {
  if (!mainWord) return;
  setLoadingExample(true);
  setErrorExample(null);

  try {
    const url = `https://corsproxy.io/?https://tatoeba.org/en/api_v0/search?query=${encodeURIComponent(mainWord)}&from=jpn&to=eng&orphans=no&unapproved=no`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const jp = data.results[0].text;
      const eng = data.results[0].translations?.[0]?.text || "No English translation.";
      setExampleSentence(`${jp}\n${eng}`);
    } else {
      setErrorExample('No example found.');
      setExampleSentence('');
    }
  } catch (err) {
    setErrorExample('Failed to fetch example sentence.');
    setExampleSentence('');
  } finally {
    setLoadingExample(false);
  }
};




  useEffect(() => {
    fetchExampleSentence();
  }, [mainWord]);

  return (
    <div className="search-result-container">
      <div className="result-flex-row">
        {/* Left: Main Kanji Card */}
        <div className="main-kanji-card">
          <div className="kanji-reading">
            <span>{mainWord}, </span>
            <h4>{reading}</h4>
          </div>
          {meanings.map((meaning, index) => (
            <p key={index} className="main-kanji-meaning-text">{meaning}</p>
          ))}
        </div>

        <div className="vertical-line" />

        <div className="result-section">
          <div className="literal-word">
            <span>{mainWord}</span>
          </div>
          <div className="reading-card">
            <span>Reading: </span>
            <span className="reading-text">{reading}</span>
            <button
              className="pronunciation-button"
              onClick={() => playPronunciation(reading)}
              title="Play pronunciation"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <div className="info-card">
            {isCommon && <span className="info-tag common-tag">common</span>}
            {jlptLevel && <span className="info-tag jlpt-tag">JLPT {jlptLevel}</span>}
          </div>
          {meanings.map((meaning, idx) => (
            <div className="definition-card" key={idx}>
              {partOfSpeech && (
                <div className="part-of-speech">
                  <span className="speech-tag">{partOfSpeech}</span>
                </div>
              )}
              <div className="meaning-card">
                <span className="meaning-label">Meaning:</span> {meaning}
              </div>
            </div>
          ))}

          {/* Phần câu ví dụ */}
          <div className="example-sentence-section">
            <h4>Example Sentence</h4>
            {loadingExample && <p>Loading example...</p>}
            {errorExample && <p className="error-text">{errorExample}</p>}
            {!loadingExample && !errorExample && exampleSentence && (
              <>
                {exampleSentence.split('\n').map((line, i) => (
                  <p key={i} className={i === 0 ? "example-japanese" : "example-english"}>
                    {line}
                  </p>
                ))}
              </>
            )}
            <button
              className="recreate-button"
              onClick={fetchExampleSentence}
              disabled={loadingExample}
            >
              {loadingExample ? 'Generating...' : 'Recreate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
