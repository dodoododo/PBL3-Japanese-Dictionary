import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Flashcard from './Flashcard.jsx';
import { JLPT_DATA } from '../../data';
import './Flashcard.css';

const FlashcardPage = () => {
  const { level } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cards;
    if (level && JLPT_DATA[level]) {
      cards = JLPT_DATA[level].map(item => ({
        id: Math.random(),
        kanji: item.kanji,
        reading: item.reading || '',
        meaning: item.meaning
      }));
    } else {
      cards = [
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
    }
    setFlashcards(cards);
  }, [level]);

  function nextQuestion() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  }

  function prevQuestion() {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1);
  }

  return (  
    <div className="flashcard-container">    
      <h2 className="flashcard-title">
        {level ? `JLPT ${level} Flashcards` : 'Flashcards'}
      </h2>
      {flashcards.length > 0 && <Flashcard flashcard={flashcards[currentIndex]} />}
      <div className="button-container">
        <button className="btn" onClick={prevQuestion}>Câu trước</button>
        <div className="progress">
          {currentIndex + 1}/{flashcards.length}
        </div>
        <button className="btn" onClick={nextQuestion}>Câu sau</button>
      </div>
    </div>
  );
}

export default FlashcardPage;
