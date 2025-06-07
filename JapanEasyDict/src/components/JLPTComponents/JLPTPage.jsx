import React, { useState } from 'react';
import { ChevronRight, BookOpen, FileText, Download, PlayCircle, List, Grid3X3 } from 'lucide-react';
import VocabularyList from './VocabularyList'; // Import VocabularyList component
import './JLPT.css';

const JLPTPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showListView, setShowListView] = useState(false); // New state for list view

  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];
  const categories = [
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      icon: BookOpen,
      description: 'Words By JLPT Level',
      color: 'blue',
      gradient: 'blue-gradient'
    },
    {
      id: 'kanji',
      name: 'Kanji',
      icon: FileText,
      description: 'Kanjis By JLPT Level',
      color: 'purple',
      gradient: 'purple-gradient'
    }
  ];

  // Mock data - expanded to match VocabularyList expected format
  const mockData = {
    vocabulary: {
      N1: { 
        count: null, 
        items: [
          { word: '語彙', reading: 'ごい', meaning: 'Từ vựng', example: '語彙力を高める' },
          { word: '単語', reading: 'たんご', meaning: 'Từ đơn', example: '新しい単語を覚える' },
          { word: '表現', reading: 'ひょうげん', meaning: 'Biểu đạt', example: '適切な表現を使う' }
        ]
      },
      N2: { 
        count: 1500, 
        items: [
          { word: '基本', reading: 'きほん', meaning: 'Cơ bản', example: '基本を学ぶ' },
          { word: '応用', reading: 'おうよう', meaning: 'Ứng dụng', example: '応用問題を解く' },
          { word: '実用', reading: 'じつよう', meaning: 'Thực dụng', example: '実用的な知識' }
        ]
      },
      N3: { 
        count: 1200, 
        items: [
          { word: '日常', reading: 'にちじょう', meaning: 'Hàng ngày', example: '日常会話' },
          { word: '会話', reading: 'かいわ', meaning: 'Hội thoại', example: '会話を楽しむ' },
          { word: '文法', reading: 'ぶんぽう', meaning: 'Ngữ pháp', example: '文法を勉強する' }
        ]
      },
      N4: { 
        count: 800, 
        items: [
          { word: '初級', reading: 'しょきゅう', meaning: 'Sơ cấp', example: '初級コース' },
          { word: '基礎', reading: 'きそ', meaning: 'Nền tảng', example: '基礎を固める' },
          { word: '練習', reading: 'れんしゅう', meaning: 'Luyện tập', example: '練習する' }
        ]
      },
      N5: { 
        count: 600, 
        items: [
          { word: '入門', reading: 'にゅうもん', meaning: 'Nhập môn', example: '入門書を読む' },
          { word: '基本', reading: 'きほん', meaning: 'Cơ bản', example: '基本的な言葉' },
          { word: '簡単', reading: 'かんたん', meaning: 'Đơn giản', example: '簡単な質問' }
        ]
      }
    },
    kanji: {
      N1: { 
        count: 1000, 
        items: [
          { word: '漢字', reading: 'かんじ', meaning: 'Chữ Hán', example: '漢字を覚える' },
          { word: '読み', reading: 'よみ', meaning: 'Cách đọc', example: '読み方を確認する' },
          { word: '意味', reading: 'いみ', meaning: 'Ý nghĩa', example: '意味を理解する' }
        ]
      },
      N2: { 
        count: 800, 
        items: [
          { word: '文字', reading: 'もじ', meaning: 'Chữ cái', example: '文字を書く' },
          { word: '書き', reading: 'かき', meaning: 'Viết', example: '書き方を学ぶ' },
          { word: '覚え', reading: 'おぼえ', meaning: 'Ghi nhớ', example: '覚えるのが大変' }
        ]
      },
      N3: { 
        count: 600, 
        items: [
          { word: '基本', reading: 'きほん', meaning: 'Cơ bản', example: '基本漢字' },
          { word: '練習', reading: 'れんしゅう', meaning: 'Luyện tập', example: '漢字練習' },
          { word: '学習', reading: 'がくしゅう', meaning: 'Học tập', example: '学習を続ける' }
        ]
      },
      N4: { 
        count: 400, 
        items: [
          { word: '初級', reading: 'しょきゅう', meaning: 'Sơ cấp', example: '初級漢字' },
          { word: '簡単', reading: 'かんたん', meaning: 'Đơn giản', example: '簡単な漢字' },
          { word: '覚える', reading: 'おぼえる', meaning: 'Ghi nhớ', example: '漢字を覚える' }
        ]
      },
      N5: { 
        count: 200, 
        items: [
          { word: '入門', reading: 'にゅうもん', meaning: 'Nhập môn', example: '入門漢字' },
          { word: '基礎', reading: 'きそ', meaning: 'Nền tảng', example: '基礎漢字' },
          { word: '始める', reading: 'はじめる', meaning: 'Bắt đầu', example: '漢字を始める' }
        ]
      }
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedLevel(null);
    setShowListView(false);
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setShowListView(false);
  };

  const handleExportPDF = (selectedData = null) => {
    if (selectedData) {
      alert(`Xuất PDF cho ${selectedCategory.name} - ${selectedLevel} với ${selectedData.length} mục đã chọn`);
    } else {
      alert(`Xuất PDF cho ${selectedCategory.name} - ${selectedLevel}`);
    }
  };

  const handleStartFlashcards = (selectedData = null) => {
    if (selectedData) {
      alert(`Bắt đầu học flashcards ${selectedCategory.name} - ${selectedLevel} với ${selectedData.length} mục đã chọn`);
    } else {
      alert(`Bắt đầu học flashcards ${selectedCategory.name} - ${selectedLevel}`);
    }
  };

  const handleViewList = () => {
    setShowListView(true);
  };

  const handleBackFromList = () => {
    setShowListView(false);
  };

  const resetSelection = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
    setShowListView(false);
  };

  return (
    <div className="JLPTPage-container">
      <div className="JLPTPage-content">
        {/* Breadcrumb */}
        {(selectedCategory || selectedLevel) && !showListView && (
          <div className="JLPTPage-breadcrumb">
            <button 
              onClick={resetSelection}
              className="JLPTPage-breadcrumb-link"
            >
              JLPT
            </button>
            {selectedCategory && (
              <>
                <ChevronRight size={16} />
                <button 
                  onClick={() => {
                    setSelectedLevel(null);
                    setShowListView(false);
                  }}
                  className="JLPTPage-breadcrumb-link"
                >
                  {selectedCategory.name}
                </button>
              </>
            )}
            {selectedLevel && (
              <>
                <ChevronRight size={16} />
                <span className="JLPTPage-breadcrumb-current">{selectedLevel}</span>
              </>
            )}
          </div>
        )}

        {/* List View */}
        {showListView && selectedCategory && selectedLevel && (
          <VocabularyList
            category={selectedCategory}
            level={selectedLevel}
            data={mockData[selectedCategory.id][selectedLevel].items}
            onBack={handleBackFromList}
            onStartFlashcards={handleStartFlashcards}
            onExportPDF={handleExportPDF}
          />
        )}

        {/* Header */}
        {!showListView && (
          <div className="JLPTPage-header">
            <h1 className="JLPTPage-title">JLPT Data Center</h1>
            <p className="JLPTPage-subtitle">
              Learn Japanese By JLPT Level
            </p>
          </div>
        )}

        {/* Category Selection */}
        {!selectedCategory && !showListView && (
          <div className="JLPTPage-category-grid">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="JLPTPage-category-card"
                >
                  <div className={`JLPTPage-category-icon ${category.gradient}`}>
                    <IconComponent size={32} />
                  </div>
                  <h3 className="JLPTPage-category-title">{category.name}</h3>
                  <p className="JLPTPage-category-description">{category.description}</p>
                  <div className="JLPTPage-category-action">
                    <span>Access</span>
                    <ChevronRight size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Level Selection */}
        {selectedCategory && !selectedLevel && !showListView && (
          <div className="JLPTPage-level-section">
            <div className="JLPTPage-level-header">
              <h2 className="JLPTPage-level-title">
                Select JLPT Level {selectedCategory.name}
              </h2>
              <div className="JLPTPage-view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`JLPTPage-view-button ${viewMode === 'grid' ? 'active' : ''}`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`JLPTPage-view-button ${viewMode === 'list' ? 'active' : ''}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            <div className={`JLPTPage-level-grid ${viewMode === 'list' ? 'list-mode' : 'grid-mode'}`}>
              {levels.map((level) => {
                const levelData = mockData[selectedCategory.id][level];
                return (
                  <div
                    key={level}
                    onClick={() => handleLevelSelect(level)}
                    className={`JLPTPage-level-card ${viewMode}`}
                  >
                    <div className="JLPTPage-level-card-content">
                      <div className={`JLPTPage-level-badge ${selectedCategory.gradient}`}>
                        {level}
                      </div>
                      <div className="JLPTPage-level-info">
                        <h3 className="JLPTPage-level-name">JLPT {level}</h3>
                      </div>
                    </div>
                    <div className="JLPTPage-level-arrow">
                      <ChevronRight size={viewMode === 'list' ? 24 : 16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Study Options */}
        {selectedCategory && selectedLevel && !showListView && (
          <div className="JLPTPage-study-section">
            <div className="JLPTPage-study-header">
              <div className={`JLPTPage-study-badge ${selectedCategory.gradient}`}>
                {selectedLevel}
              </div>
              <h2 className="JLPTPage-study-title">
                {selectedCategory.name} - JLPT {selectedLevel}
              </h2>
            </div>

            <div className="JLPTPage-options-grid">
              <div onClick={handleViewList} className="JLPTPage-option-card green">
                <div className="JLPTPage-option-icon green-bg">
                  <List size={24} />
                </div>
                <h3 className="JLPTPage-option-title">See List</h3>
                <p className="JLPTPage-option-description">
                  See All {selectedCategory.name.toLowerCase()} List
                </p>
                <div className="JLPTPage-option-action green-text">
                  <span>Start</span>
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="JLPTPage-option-card blue">
                <div className="JLPTPage-option-icon blue-bg">
                  <PlayCircle size={24} />
                </div>
                <h3 className="JLPTPage-option-title">Flashcards</h3>
                <p className="JLPTPage-option-description">
                  Study By Flashcard
                </p>
              </div>

              <div className="JLPTPage-option-card purple">
                <div className="JLPTPage-option-icon purple-bg">
                  <Download size={24} />
                </div>
                <h3 className="JLPTPage-option-title">Generate PDF</h3>
                <p className="JLPTPage-option-description">
                  Download PDF for easy Access
                </p>
              </div>
            </div>

            {/* Sample Items Preview */}
            {/* <div className="JLPTPage-preview">
              <h4 className="JLPTPage-preview-title">Preview Content:</h4>
              <div className="JLPTPage-preview-items">
                {mockData[selectedCategory.id][selectedLevel].items.map((item, index) => (
                  <span key={index} className="JLPTPage-preview-item">
                    {item.word}
                  </span>
                ))}
                <span className="JLPTPage-preview-more">
                  +{mockData[selectedCategory.id][selectedLevel].count - 3} more...
                </span>
              </div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default JLPTPage;