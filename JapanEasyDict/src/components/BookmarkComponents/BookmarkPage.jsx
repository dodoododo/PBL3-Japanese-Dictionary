import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, PlayCircle, Eye, EyeOff, Trash2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import './VocabularyList.css';

const BookmarkPage = ({ onBack }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMeaning, setShowMeaning] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  // Fetch saved words and their details
  useEffect(() => {
    const fetchSavedWords = async () => {
      if (!userId) {
        setError('Please log in to view saved words.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Step 1: Fetch saved words for the user
        const savedWordsResponse = await axios.get(`http://localhost:8082/api/saved-words/user/${userId}`, {
          headers: { 'Accept': 'application/json' }
        });
        console.log('Saved words response:', savedWordsResponse.data);
        const savedWordsData = savedWordsResponse.data;

        if (!savedWordsData || savedWordsData.length === 0) {
          setSavedWords([]);
          setLoading(false);
          return;
        }

        // Step 2: Extract word IDs and fetch word details
        const wordIds = savedWordsData.map(word => word.id.wordId);
        console.log('Word IDs:', wordIds);
        const wordsResponse = await axios.post(`http://localhost:8082/api/words/by-ids`, wordIds, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Words response:', wordsResponse.data);
        const wordsData = wordsResponse.data;

        // Map word data to match VocabularyList format
        const mappedData = wordsData.map(word => ({
          id: word.id,
          word: word.word || 'N/A',
          reading: word.reading || '',
          meaning: word.meaning || '',
          example: word.example || ''
        }));

        setSavedWords(mappedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching saved words:', err);
        setError('Failed to load saved words.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedWords();
  }, [userId]);

  // Filter data based on search term
  const filteredData = savedWords.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.reading && item.reading.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectItem = (index) => {
    setSelectedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map((_, index) => index));
    }
  };

  const handleDeleteWord = async (wordId) => {
    if (!userId) {
      alert('Please log in to delete saved words.');
      return;
    }

    try {
      await axios.delete(`http://localhost:8082/api/saved-words/user/${userId}/word/${wordId}`);
      setSavedWords(prev => prev.filter(word => word.id !== wordId));
      setSelectedItems(prev => prev.filter(index => filteredData[index]?.id !== wordId));
      alert('Word removed successfully!');
    } catch (err) {
      console.error('Error deleting word:', err);
      alert('Failed to remove word.');
    }
  };

  const handleExportSelected = () => {
    const selectedData = selectedItems.map(index => filteredData[index]);
    
    const element = document.createElement('div');
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.padding = '15mm';
    element.style.width = '180mm';
    element.style.minHeight = '267mm';
    element.style.fontSize = '14px';

    const style = document.createElement('style');
    style.textContent = `
      @layer base {
        img { display: initial; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          break-inside: avoid; 
          margin: 20px 0;
        }
        th, td { 
          border: 1px solid #000; 
          padding: 12px; 
          text-align: left; 
          break-inside: avoid; 
          line-height: 1.5;
        }
        tr { 
          break-inside: avoid; 
          break-after: auto; 
        }
        th { 
          background-color: #f0f0f0; 
          font-weight: bold; 
          font-size: 16px;
        }
      `;
    element.appendChild(style);

    const title = document.createElement('h1');
    title.textContent = 'Saved Words';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.style.fontSize = '18px';
    element.appendChild(title);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Word', 'Reading', 'Meaning'].forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    selectedData.forEach(item => {
      const row = document.createElement('tr');
      [item.word, item.reading || '-', item.meaning || '-'].forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText;
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    element.appendChild(table);

    const opt = {
      margin: [15, 15],
      filename: `Saved_Words.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleFlashcardsSelected = () => {
    const selectedData = selectedItems.map(index => filteredData[index]);
    navigate('/flashcards/saved', { state: { selectedData } });
  };

  return (
    <div className="VocabularyList-container">
      <div className="VocabularyList-content">
        {/* Header */}
        <div className="VocabularyList-header">
          <div className="VocabularyList-title-section">
            <h1 className="VocabularyList-title">Saved Words</h1>
            <p className="VocabularyList-subtitle">
              {loading ? 'Loading...' : `${filteredData.length} / ${savedWords.length} Items`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="VocabularyList-controls">
          <div className="VocabularyList-search-section">
            <div className="VocabularyList-search-box">
              <Search size={20} className="VocabularyList-search-icon" />
              <input
                type="text"
                placeholder="Search Saved Words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="VocabularyList-search-input"
              />
            </div>
            
            <div className="VocabularyList-view-controls">
              <button
                onClick={() => setShowMeaning(!showMeaning)}
                className="VocabularyList-toggle-button"
              >
                {showMeaning ? <EyeOff size={18} /> : <Eye size={18} />}
                <span>{showMeaning ? 'Hide Meanings' : 'Show Meanings'}</span>
              </button>
            </div>
          </div>

          <div className="VocabularyList-action-section">
            <div className="VocabularyList-selection-info">
              <button
                onClick={handleSelectAll}
                className="VocabularyList-select-all"
              >
                {selectedItems.length === filteredData.length ? 'Deselect All' : 'Select All'}
              </button>
              {selectedItems.length > 0 && (
                <span className="VocabularyList-selected-count">
                  Selected: {selectedItems.length}
                </span>
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="VocabularyList-action-buttons">
                <button
                  onClick={handleFlashcardsSelected}
                  className="VocabularyList-action-button flashcard"
                >
                  <PlayCircle size={18} />
                  <span>Flashcard</span>
                </button>
                <button
                  onClick={handleExportSelected}
                  className="VocabularyList-action-button export"
                >
                  <Download size={18} />
                  <span>Generate PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="VocabularyList-empty">
            <p>Loading saved words...</p>
          </div>
        ) : error ? (
          <div className="VocabularyList-empty">
            <p>{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="VocabularyList-empty">
            <p>No saved words found.</p>
          </div>
        ) : (
          <div className="VocabularyList-grid">
            {filteredData.map((item, index) => (
              <div
                key={item.id}
                className={`VocabularyList-item ${selectedItems.includes(index) ? 'selected' : ''}`}
                onClick={() => handleSelectItem(index)}
              >
                <div className="VocabularyList-item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(index)}
                    onChange={() => {}}
                    className="VocabularyList-checkbox"
                  />
                </div>
                
                <div className="VocabularyList-item-content">
                  <div className="VocabularyList-word-section">
                    <div className="VocabularyList-word">{item.word}</div>
                    {item.reading && (
                      <div className="VocabularyList-reading">{item.reading}</div>
                    )}
                  </div>
                  
                  {showMeaning && (
                    <div className="VocabularyList-meaning">{item.meaning}</div>
                  )}
                  
                  {item.example && (
                    <div className="VocabularyList-example">
                      <strong>Example:</strong> {item.example}
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWord(item.id);
                    }}
                    className="VocabularyList-delete-button"
                    title="Remove from saved words"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;