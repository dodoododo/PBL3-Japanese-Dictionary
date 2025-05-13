import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { JLPT_DATA } from '../../data';
import './JLPT.css';

const ITEMS_PER_PAGE = 16;
const MAX_VISIBLE_PAGES = 5;

const KanjiList = () => {
  const { level } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedLevel = level?.toUpperCase();
  const kanjiList = JLPT_DATA[normalizedLevel] || [];
  const totalPages = Math.ceil(kanjiList.length / ITEMS_PER_PAGE);
  
  // Đảm bảo currentPage không vượt quá totalPages
  const validatedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  if (validatedCurrentPage !== currentPage) {
    setCurrentPage(validatedCurrentPage);
  }

  const startIndex = (validatedCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentKanji = kanjiList.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    // Đảm bảo số trang hợp lệ
    const newPage = Math.min(Math.max(1, pageNumber), totalPages);
    setCurrentPage(newPage);
  };

  // Tạo mảng các số trang cần hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, validatedCurrentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    // Điều chỉnh lại startPage nếu endPage đã đạt giới hạn
    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    // Thêm trang đầu nếu cần
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    // Thêm các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Thêm trang cuối nếu cần
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="kanji-list-container">
      <h1 className="jlpt-title">JLPT {normalizedLevel} - Kanji List</h1>
      
      <div className="kanji-list-pagination">
        {currentKanji.map((kanji, index) => (
          <div key={index} className="kanji-item">
            <div className="kanji-character">{kanji.kanji}</div>
            <div className="kanji-details">
              <div className="kanji-list-reading">{kanji.reading}</div>
              <div className="kanji-meaning">{kanji.meaning}</div>
            </div>
          </div>
        ))}
      </div>

      {kanjiList.length > 0 && (
        <div className="pagination">
          {validatedCurrentPage > 1 && (
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(validatedCurrentPage - 1)}
            >
              Previous
            </button>
          )}

          <div className="page-numbers">
            {getPageNumbers().map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === '...' ? (
                  <span className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    className={`pagination-button ${pageNumber === validatedCurrentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {validatedCurrentPage < totalPages && (
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(validatedCurrentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default KanjiList; 