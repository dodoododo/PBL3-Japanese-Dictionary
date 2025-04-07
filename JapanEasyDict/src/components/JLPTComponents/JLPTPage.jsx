import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JLPT_DATA } from '../../data';
import './JLPT.css';

const JLPTPage = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const navigate = useNavigate();
  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  const startFlashcards = () => {
    if (selectedLevel) {
      navigate(`/flashcards/${selectedLevel}`);
    }
  };

  return (
    <div className="jlpt-container">
      <h1 className="jlpt-title">JLPT Study</h1>
      <div className="level-grid">
        {levels.map((level) => (
          <div
            key={level}
            className={`level-card ${selectedLevel === level ? 'selected' : ''}`}
            onClick={() => handleLevelSelect(level)}
          >
            <h2>{level}</h2>
            <p>{JLPT_DATA[level].length} từ vựng</p>
          </div>
        ))}
      </div>

      {selectedLevel && (
        <div className="study-options">
          <h2>Học {selectedLevel}</h2>
          <div className="options-grid">
            <div className="option-card" onClick={startFlashcards}>
              <h3>Flashcards</h3>
              <p>Học với thẻ ghi nhớ</p>
            </div>
            <div className="option-card">
              <h3>Quiz</h3>
              <p>Kiểm tra kiến thức</p>
            </div>
            <div className="option-card">
              <h3>Luyện nói, viết</h3>
              <p>Thực hành phát âm và viết</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JLPTPage; 