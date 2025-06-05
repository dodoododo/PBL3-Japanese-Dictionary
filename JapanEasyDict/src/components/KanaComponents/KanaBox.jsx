import React from 'react';
import './kana-styles.css';

const KanaBox = (props) => {
  if (props.blind) {
    // Blind mode: just a gray box, no text
    return (
      <div className="kana-box"></div>
    );
  }
  return (
    <div className="kana-box">
      <div className="kana-text-kana">{props.data.kana}</div>
      <div className="kana-text-romaji">{props.data.romaji}</div>
    </div>
  );
};

export default KanaBox;