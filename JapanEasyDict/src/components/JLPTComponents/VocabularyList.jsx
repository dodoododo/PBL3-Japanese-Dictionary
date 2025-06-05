import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, PlayCircle, Eye, EyeOff } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './VocabularyList.css';

const VocabularyList = ({ 
  category, 
  level, 
  data, 
  onBack, 
  onStartFlashcards, 
  onExportPDF 
}) => {
  const { level: urlLevel } = useParams(); // Get level from URL
  const navigate = useNavigate(); // Added for navigation
  const [searchTerm, setSearchTerm] = useState('');
  const [showMeaning, setShowMeaning] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [kanjiList, setKanjiList] = useState(data || []); // Initialize with prop data
  const [loading, setLoading] = useState(true);

  const normalizedLevel = (urlLevel || level)?.toUpperCase();
  const numericLevel = parseInt(normalizedLevel?.replace('N', ''), 10);

  // Fetch data based on category (Kanji or Vocabulary)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let apiData;
        if (category.name === 'Vocabulary') {
          const response = await fetch(`http://localhost:8082/api/words/jlpt?jlpt_level=${numericLevel}`);
          apiData = await response.json();
          // Map Word API data to match VocabularyList expected format
          apiData = apiData.map(word => ({
            word: word.word,
            reading: word.reading || '',
            meaning: word.meaning || '',
            example: word.example || '' // Include example if available, empty string if not
          }));
        } else {
          const response = await fetch(`http://localhost:8082/api/kanji?jlpt_level=${numericLevel}`);
          apiData = await response.json();
          // Map Kanji API data to match VocabularyList expected format
          apiData = apiData.map(kanji => ({
            word: kanji.kanji,
            reading: `${kanji.onyomi || ''}${kanji.onyomi && kanji.kunyomi ? ', ' : ''}${kanji.kunyomi || ''}`,
            meaning: kanji.meaning,
            example: kanji.example || '' // Include example if available, empty string if not
          }));
        }
        setKanjiList(apiData);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        // Fallback to prop data if API fails
        setKanjiList(data || []);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(numericLevel)) {
      fetchData();
    } else {
      setKanjiList(data || []); // Use prop data if level is invalid
      setLoading(false);
    }
  }, [numericLevel, data, category.name]);

  // Filter data based on search term
  const filteredData = kanjiList.filter(item => 
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

  const handleExportSelected = () => {
    const selectedData = selectedItems.map(index => filteredData[index]);
    
    // Create a hidden HTML element for PDF generation
    const element = document.createElement('div');
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.padding = '15mm';
    element.style.width = '180mm'; // Adjusted to fit A4 with margins
    element.style.minHeight = '267mm'; // Adjusted for A4 height with margins
    element.style.fontSize = '14px'; // Increased font size for larger table

    // Add CSS for table and page break control
    const style = document.createElement('style');
    style.textContent = `
      @layer base {
        img { display: initial; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          break-inside: avoid; 
          margin: 20px 0; // Added margin for spacing around table
        }
        th, td { 
          border: 1px solid #000; 
          padding: 12px; // Increased padding for more spacing around words
          text-align: left; 
          break-inside: avoid; 
          line-height: 1.5; // Added line height for better readability
        }
        tr { 
          break-inside: avoid; 
          break-after: auto; 
        }
        th { 
          background-color: #f0f0f0; 
          font-weight: bold; 
          font-size: 16px; // Larger font for headers
        }
      `;
    element.appendChild(style);

    // Add title
    const title = document.createElement('h1');
    title.textContent = `${category.name} - JLPT ${normalizedLevel}`;
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px'; // Increased for more spacing
    title.style.fontSize = '18px'; // Slightly larger title
    element.appendChild(title);

    // Create table
    const table = document.createElement('table');
    
    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Word', 'Reading', 'Meaning', 'Example'].forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');
    selectedData.forEach(item => {
      const row = document.createElement('tr');
      [item.word, item.reading || '-', item.meaning || '-', item.example || '-'].forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText;
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    element.appendChild(table);

    // Configure html2pdf options
    const opt = {
      margin: [15, 15], // Consistent margins
      filename: `${category.name}_JLPT_${normalizedLevel}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate and download PDF
    html2pdf().from(element).set(opt).save();

    // Call the onExportPDF prop if provided
    if (onExportPDF) {
      onExportPDF(selectedData);
    }
  };

  const handleFlashcardsSelected = () => {
    const selectedData = selectedItems.map(index => filteredData[index]);
    // Navigate to FlashcardPage with selected data
    navigate(`/flashcards/${normalizedLevel}`, { state: { selectedData } });
  };

  return (
    <div className="VocabularyList-container">
      <div className="VocabularyList-content">
        {/* Header */}
        <div className="VocabularyList-header">
          <button onClick={onBack} className="VocabularyList-back-button">
            <ArrowLeft size={20} />
            <span>Return</span>
          </button>
          
          <div className="VocabularyList-title-section">
            <h1 className="VocabularyList-title">
              {category.name} - JLPT {normalizedLevel}
            </h1>
            <p className="VocabularyList-subtitle">
              {loading ? 'Loading...' : `${filteredData.length} / ${kanjiList.length} Items`}
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
                placeholder={category.name === 'Vocabulary' ? 'Search Word...' : 'Search Kanji...'}
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
            <p>Give me a minute...</p>
          </div>
        ) : (
          <div className="VocabularyList-grid">
            {filteredData.map((item, index) => (
              <div
                key={index}
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
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredData.length === 0 && !loading && (
          <div className="VocabularyList-empty">
            <p>Không tìm thấy kết quả nào cho "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyList;