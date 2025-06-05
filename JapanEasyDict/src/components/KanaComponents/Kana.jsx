import React, { useState, useEffect, Suspense } from 'react';
import { hiragana } from '../data/hiragana';
import { katakana } from '../data/katakana';
import KanaContainer from './KanaContainer';
import H1 from '../H1';
import './kana-styles.css';

const Kana = (props) => {
  const [kana, setKana] = useState([]);
  useEffect(() => {
    if (props.title === 'Hiragana') {
      setKana(hiragana);
    } else if (props.title === 'Katakana') {
      setKana(katakana);
    }
    window.scrollTo(0, 0);
  }, [props.title]);

  return (
    <div className="kana-text-center kana-main-container">
      <H1 span={props.symbol} text={props.title} />
      <div className="kana-grid kana-grid-padding kana-box-shadow kana-space-y">
        <KanaContainer kana={kana} />
      </div>
    </div>
  );
};

export default Kana;