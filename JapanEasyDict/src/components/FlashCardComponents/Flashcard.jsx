import React, { useState, useEffect } from 'react';

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  
  useEffect(() => {setFlip(false);}, [flashcard]);

  return (
    <div className={`card ${flip ? 'flip' : ''}`} onClick={() => setFlip(!flip)}>
      {!flip ? (
        <div className="front kanji">{flashcard.kanji}</div>
      ) : (
        <div className="back">
          <div className="reading">{flashcard.reading}</div>
          <div className="meaning">{flashcard.meaning}</div>
        </div>
      )}
    </div>
  );
}
