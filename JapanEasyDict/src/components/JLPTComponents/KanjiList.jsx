import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './JLPT.css';

const ITEMS_PER_PAGE = 25;
const MAX_VISIBLE_PAGES = 10;

const KanjiList = () => {
  const { level } = useParams();
  const [kanjiList, setKanjiList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const normalizedLevel = level?.toUpperCase();
  const numericLevel = parseInt(normalizedLevel?.replace('N', ''), 10);

  useEffect(() => {
    const fetchKanji = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8082/api/kanji?jlpt_level=${numericLevel}`);
        const data = await response.json();
        setKanjiList(data);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(numericLevel)) {
      fetchKanji();
    }
  }, [numericLevel]);

  const totalPages = Math.ceil(kanjiList.length / ITEMS_PER_PAGE);
  const validatedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validatedCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentKanji = kanjiList.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    const newPage = Math.min(Math.max(1, pageNumber), totalPages);
    setCurrentPage(newPage);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, validatedCurrentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="kanji-list-container">
      <h1 className="jlpt-title">JLPT {normalizedLevel} - Kanji List</h1>

      {loading ? (
        <p>Page is loading...</p>
      ) : (
        <>
          <div className="kanji-list-pagination">
            {currentKanji.map((kanji, index) => (
              <div key={index} className="kanji-item">
                <div className="kanji-character">{kanji.kanji}</div>
                <div className="kanji-details">
                  <div className="kanji-list-reading">
                    <p><b>On: </b>{kanji.onyomi}</p>
                    <p><b>Kun: </b>{kanji.kunyomi}</p>
                  </div>
                  <div className="kanji-meaning">{kanji.meaning}</div>
                </div>
              </div>
            ))}
          </div>

          {kanjiList.length > 0 && (
            <div className="pagination">
              {validatedCurrentPage > 1 && (
                <button className="pagination-button" onClick={() => handlePageChange(validatedCurrentPage - 1)}>
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
                <button className="pagination-button" onClick={() => handlePageChange(validatedCurrentPage + 1)}>
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KanjiList;
