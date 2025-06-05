import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Flashcard from './Flashcard.jsx';
import './Flashcard.css';

const FlashcardPage = () => {
  const { level } = useParams();
  const { state } = useLocation(); // Get data passed from VocabularyList
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cards = [];
    if (state && state.selectedData) {
      // Use selected data from VocabularyList
      cards = state.selectedData.map((item, index) => ({
        id: index, // Use index as unique ID
        kanji: item.word, // Map 'word' to 'kanji' for compatibility
        reading: item.reading || '',
        meaning: item.meaning || ''
      }));
    }
    setFlashcards(cards);
  }, [state]);

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
        <button className="btn" onClick={prevQuestion}>Previous</button>
        <div className="progress">
          {currentIndex + 1}/{flashcards.length}
        </div>
        <button className="btn" onClick={nextQuestion}>Next</button>
      </div>
    </div>
  );
}

export default FlashcardPage;