import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard.jsx';
import './Flashcard.css';

function FlashcardPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const dummyData = [
      { 
        id: 1, 
        kanji: "水", 
        reading: "みず (mizu)", 
        meaning: "nước" 
      },
      { 
        id: 2, 
        kanji: "火", 
        reading: "ひ (hi)", 
        meaning: "lửa" 
      },
      { 
        id: 3, 
        kanji: "木", 
        reading: "き (ki)", 
        meaning: "cây" 
      },
    ];
    setFlashcards(dummyData);
  }, []);

  function nextQuestion() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  }
  function prevQuestion() {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1);
  }

  return (  
    <div className="flashcard-container">    
      {flashcards.length > 0 && <Flashcard flashcard={flashcards[currentIndex]} />}
      <div className="button-container">
        <button className="btn" onClick={prevQuestion}>Previous Question</button>
        <div className="progress">
          {currentIndex + 1}/{flashcards.length}
        </div>
        <button className="btn" onClick={nextQuestion}>Next Question</button>
      </div>
    </div>
  );
}

export default FlashcardPage;
